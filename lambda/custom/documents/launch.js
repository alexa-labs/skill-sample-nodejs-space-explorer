/*
 * Copyright 2018 Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * 
 * Licensed under the Amazon Software License (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 * 
 * http: //aws.amazon.com/asl/
 * 
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

const data = require('../data/planets.json');
const cdnPath = require('../helpers/cdn-path');

module.exports = () => {
  const planets = [];

  Object.keys(data).forEach(k => {
    if (k !== 'backgroundImage' && k !== 'pluto') {
      planets.push(data[k]);
    }
  });

  planets.sort((a, b) => a.distance - b.distance);

  return {
    type: 'Alexa.Presentation.APL.RenderDocument',
    token: 'splash-screen',
    document: {
      type: 'APL',
      version: '1.0',
      theme: 'dark',
      import: [
        {
          name: 'alexa-styles',
          version: '1.0.0-beta'
        },
        {
          name: 'alexa-layouts',
          version: '1.0.0-beta'
        },
        {
          name: 'layouts',
          version: '1.0.0',
          source: `${cdnPath}apl/layouts.json`
        },
        {
          name: 'styles',
          version: '1.0.0',
          source: `${cdnPath}apl/styles.json`
        }
      ],
      resources: [
        {
          when: '${viewport.width > 1280}',
          strings: {
            landingImage: 'https://d1od0khoye9qi3.cloudfront.net/assets/landing_1920_1080.jpg'
          }
        },
        {
          when: '${viewport.width > 1024}',
          strings: {
            landingImage: 'https://d1od0khoye9qi3.cloudfront.net/assets/landing_1280_800.jpg'
          }
        },
        {
          when: '${viewport.width > 480}',
          strings: {
            landingImage: 'https://d1od0khoye9qi3.cloudfront.net/assets/landing_1024_600.jpg'
          }
        },
        {
          when: '${viewport.width <= 480}',
          strings: {
            landingImage: 'https://d1od0khoye9qi3.cloudfront.net/assets/landing_480_480.jpg'
          }
        }
      ],
      mainTemplate: {
        parameters: ['payload'],
        item: {
          type: 'Container',
          direction: 'column',
          height: '100vh',
          width: '100vw',
          position: 'absolute',
          top: 0,
          bottom: 0,
          items: [
            {
              type: 'ScrollView',
              width: '100%',
              height: '100%',
              position: 'absolute',
              onScroll: [
                {
                  type: 'SetValue',
                  componentId: 'splashImage',
                  property: 'opacity',
                  value: '${1 - (event.source.value * 2)}'
                }
              ],
              item: [
                {
                  type: 'Container',
                  paddingTop: '100vh',
                  items: [
                    {
                      type: 'Text',
                      text: 'What would you like to explore?',
                      opacity: '0',
                      id: 'splashScroller',
                      paddingTop: '100vh',
                      speech: '${payload.data.properties.speech}'
                    }
                  ]
                }
              ]
            },
            {
              type: 'Container',
              items: [
                {
                  when: '${@viewportProfile == @hubRoundSmall}',
                  type: 'SolarSystemSmallRoundHub',
                  data: '${payload.data.properties.data}'
                },
                {
                  when: '${@viewportProfile != @hubRoundSmall}',
                  type: 'SolarSystem',
                  data: '${payload.data.properties.data}'
                }
              ]
            },
            {
              type: 'Frame',
              id: 'splashImage',
              backgroundColor: 'black',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              item: [
                {
                  type: 'Container',
                  width: '100vw',
                  height: '100vh',
                  justifyContent: 'center',
                  alignItems: 'center',
                  items: [
                    {
                      type: 'Text',
                      style: 'textStyleDisplay1Alt',
                      fontSize: '20vh',
                      fontWeight: '100',
                      text: 'SPACE',
                      letterSpacing: '6.6vw'
                    },
                    {
                      type: 'Text',
                      style: 'textStyleHeadline',
                      fontSize: '5.5vh',
                      text: 'EXPLORER',
                      fontWeight: '800'
                    },
                    {
                      type: 'Image',
                      width: '100vw',
                      height: '100vh',
                      scale: 'best-fill',
                      source: '@landingImage',
                      position: 'absolute'
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    },
    datasources: {
      data: {
        properties: {
          hintText: 'take me to the inner planets.',
          speechssml: '<speak>What would you like to explore?</speak>',
          data
        },
        transformers: [
          {
            inputPath: 'hintText',
            outputName: 'hint',
            transformer: 'textToHint'
          },
          {
            inputPath: 'speechssml',
            outputName: 'speech',
            transformer: 'ssmlToSpeech'
          }
        ]
      }
    }
  };
};
