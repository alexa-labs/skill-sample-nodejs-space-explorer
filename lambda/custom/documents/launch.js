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
          version: '1.1.0-eifjccgiclfvkinnkcftdcdeklbrnlhchfcihjjdghdi'
        },
        {
          name: 'alexa-layouts',
          version: '1.1.0-eifjccgiclfvkinnkcftdcdeklbrnlhchfcihjjdghdi'
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
          strings: {
            videoLandingVideo: `${cdnPath}videos/SpaceExplorer_Splash_v2.mp4`
          }
        },
        {
          strings: {
            when: '${@viewportProfile == @hubRoundSmall || viewport.height <= 480}',
            videoLandingVideo: `${cdnPath}videos/SpaceExplorer_Splash_480.mp4`
          }
        }
      ],
      commands: {
        Reveal: {
          parameters: [],
          command: {
            type: 'Sequential',
            commands: [
              {
                type: 'Parallel',
                commands: [
                  {
                    type: 'AnimateItem',
                    componentId: 'solarSystem',
                    value: [
                      {
                        property: 'opacity',
                        from: 0,
                        to: 1
                      }
                    ],
                    duration: 1000
                  },
                  {
                    type: 'AnimateItem',
                    componentId: 'videoContainer',
                    value: [
                      {
                        property: 'opacity',
                        from: 1,
                        to: 0
                      }
                    ],
                    duration: 1000
                  },
                  {
                    type: 'SolarSystemReveal'
                  }
                ]
              }
            ]
          }
        }
      },
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
              type: 'Container',
              id: 'videoContainer',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 1,
              item: [
                { 
                  type: 'Frame',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'red',
                  position: 'absolute'
                },
                {
                  type: 'Video',
                  id: 'splashVideo',
                  width: '${@viewportProfile == @hubLandscapeSmall ? \'200vh\' : \'180vh\'}',
                  height: '100vh',
                  scale: 'best-fill',
                  position: 'absolute',
                  autoplay: true,
                  audioTrack: 'foreground',
                  source: '@videoLandingVideo',
                  onEnd: [
                    {
                      type: 'Reveal'
                    }
                  ]
                }
              ]
            },
            {
              type: 'Container',
              id: 'solarSystem',
              opacity: 0,
              items: [
                {
                  when: '${@viewportProfile == @hubRoundSmall}',
                  type: 'SolarSystemSmallRoundHub',
                  data: '${payload.data.properties.data}'
                },
                {
                  when: '${@viewportProfile != @hubRoundSmall}',
                  type: 'SolarSystem',
                  data: '${payload.data.properties.data}',
                  hintText: '${payloaddata.properties.hint}'
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
