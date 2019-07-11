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

module.exports = planet => {
  const datasource = data[planet];

  return {
    type: 'Alexa.Presentation.APL.RenderDocument',
    token: 'planet-details',
    document: {
      type: 'APML',
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
        },
        {
          name: 'soft-stagger',
          version: '1.0.0',
          source: `${cdnPath}apl/soft-stagger.json`
        }
      ],
      commands: {
        onMount: {
          command: {
            type: 'Parallel',
            commands: [
              {
                type: 'SoftStaggerBackgroundTargetted',
                componentId: 'background'
              },
              {
                type: 'AnimateItem',
                componentId: 'planetImage',
                duration: 1000,
                easing: '@alexa-out',
                value: [
                  {
                    property: 'transform',
                    from: [
                      {
                        translateX: 100
                      }
                    ],
                    to: [
                      {
                        translateX: 0
                      }
                    ]
                  },
                  {
                    property: 'opacity',
                    from: 0,
                    to: 1
                  }
                ]
              },
              {
                type: 'SoftStaggerBackgroundTargetted',
                componentId: 'listContainer'
              },
              {
                type: 'SoftStaggerChromeTargetted',
                componentId: 'header',
                fromDirection: 'bottom'
              },
              {
                type: 'SoftStaggerHintTargetted',
                componentId: 'footer',
                fromDirection: 'bottom'
              },
              {
                type: 'SoftStaggerItemTargetted',
                when: planet === 'the sun',
                componentId: 'starType',
                order: 1,
                fromDirection: 'bottom'
              },
              {
                type: 'SoftStaggerItemTargetted',
                when: planet === 'the sun',
                componentId: 'starAge',
                order: 2,
                fromDirection: 'bottom'
              },
              {
                type: 'SoftStaggerItemTargetted',
                when: `\${@viewportProfile == @tvLandscapeXLarge && '${planet}' != 'the sun'}`,
                componentId: 'yearLength',
                order: 1,
                fromDirection: 'bottom'
              },
              {
                type: 'SoftStaggerItemTargetted',
                when: `\${@viewportProfile == @tvLandscapeXLarge && '${planet}' != 'the sun'}`,
                componentId: 'dayLength',
                order: 2,
                fromDirection: 'bottom'
              },
              {
                type: 'PlanetListReveal',
                planet: planet
              }
            ]
          }
        }
      },
      onMount: [
        {
          type: 'onMount'
        }
      ],
      mainTemplate: {
        parameters: ['payload'],
        item: {
          type: 'Frame',
          backgroundColor: 'black',
          item: [
            {
              when: '${@viewportProfile != @hubRoundSmall}',
              type: 'Container',
              direction: 'column',
              id: 'container',
              height: '100%',
              width: '100%',
              items: [
                {
                  type: 'AlexaBackground',
                  id: 'background',
                  backgroundImageSource: '${payload.data.backgroundImage}',
                  opacity: 0
                },
                {
                  type: 'Image',
                  id: 'planetImage',
                  source: '${payload.data.image}',
                  left: planet === 'saturn' ? '-20%' : '42%',
                  bottom: planet === 'saturn' ? '-30%' : '20%',
                  width: planet === 'saturn' ? '200%' : '100%',
                  height: planet === 'saturn' ? '200%' : '100%',
                  position: 'absolute',
                  scale: 'best-fit',
                  opacity: 0
                },
                {
                  type: 'Image',
                  source: `${cdnPath}assets/scrim-planetdetails.png`,
                  right: 0,
                  bottom: 0,
                  height: '100vh',
                  width: planet === 'saturn' ? '100vw' : '100vh',
                  position: 'absolute',
                  scale: 'best-fill'
                },
                {
                  type: 'AlexaHeader',
                  id: 'header',
                  headerTitle: planet.toUpperCase(),
                  headerBackButton: true,
                  width: '100%',
                  opacity: 0
                },
                {
                  type: 'Container',
                  id: 'listContainer',
                  paddingLeft: '@marginHorizontal',
                  grow: 1,
                  shrink: 1,
                  opacity: 0,
                  items: [
                    {
                      type: 'PlanetDetailsList',
                      planet: planet.toLowerCase()
                    },
                    {
                      when: '${@viewportProfile == @hubLandscapeSmall}',
                      type: 'Image',
                      height: 120,
                      width: '100%',
                      scale: 'best-fill',
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      source: 'https://ddg-skill.s3-us-west-2.amazonaws.com/1px.png',
                      overlayGradient: {
                        type: 'linear',
                        colorRange: [
                          'black',
                          'transparent'
                        ],
                        inputRange: [
                          0,
                          0.4
                        ]
                      }
                    },
                    {
                      when: planet === 'the sun',
                      type: 'Container',
                      direction: 'row',
                      paddingBottom: '15dp',
                      items: [
                        {
                          type: 'Container',
                          id: 'starType',
                          spacing: '68dp',
                          items: [
                            {
                              type: 'Text',
                              style: 'textStyleCaption',
                              opacity: 0.75,
                              text: 'STAR-TYPE'
                            },
                            { type: 'Text', style: 'textStyleCallout', text: datasource.type }
                          ]
                        },
                        {
                          type: 'Container',
                          id: 'starAge',
                          spacing: '68dp',
                          items: [
                            {
                              type: 'Text',
                              style: 'textStyleCaption',
                              opacity: 0.75,
                              text: 'APPROXIMATE AGE'
                            },
                            { type: 'Text', style: 'textStyleCallout', text: datasource.age }
                          ]
                        }
                      ]
                    },
                    {
                      when: `\${@viewportProfile == @tvLandscapeXLarge && '${planet}' != 'the sun'}`,
                      type: 'Container',
                      direction: 'row',
                      paddingBottom: '15dp',
                      items: [
                        {
                          type: 'Container',
                          id: 'yearLength',
                          spacing: '68dp',
                          items: [
                            {
                              type: 'Text',
                              style: 'textStyleCaption',
                              opacity: 0.75,
                              text: 'LENGTH OF YEAR'
                            },
                            {
                              type: 'Text',
                              style: 'textStyleCallout',
                              text: `${datasource.year.toLocaleString()} Earth Days`
                            }
                          ]
                        },
                        {
                          type: 'Container',
                          id: 'dayLength',
                          spacing: '68dp',
                          items: [
                            {
                              type: 'Text',
                              style: 'textStyleCaption',
                              opacity: 0.75,
                              text: 'LENGTH OF DAY'
                            },
                            {
                              type: 'Text',
                              style: 'textStyleCallout',
                              text: `${datasource.day.toLocaleString()} Earth Hours`
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  when: '${@viewportProfile != @hubLandscapeSmall}',
                  type: 'AlexaFooter',
                  id: 'footer',
                  hintText: '${payload.data.properties.hint}',
                  opacity: 0
                }
              ]
            },
            {
              when: '${@viewportProfile == @hubRoundSmall}',
              type: 'Container',
              direction: 'column',
              height: '100%',
              width: '100%',
              items: [
                {
                  type: 'Image',
                  id: 'planetImage',
                  source: '${payload.data.image}',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  scale: 'best-fit',
                  opacity: 0
                },
                {
                  type: 'Image',
                  source: `${cdnPath}assets/rook-full-scrim.png`,
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  scale: 'best-fit'
                },
                {
                  type: 'AlexaHeader',
                  id: 'header',
                  headerTitle: planet.toUpperCase(),
                  headerAttributionPrimacy: false,
                  position: 'absolute',
                  width: '100%',
                  opacity: 0
                },
                {
                  type: 'Container',
                  id: 'listContainer',
                  paddingLeft: '@marginHorizontal',
                  paddingRight: '${@marginHorizontal / 2}',
                  paddingTop: '25vh',
                  height: '100%',
                  opacity: 0,
                  items: [
                    {
                      type: 'PlanetDetailsList',
                      planet: planet.toLowerCase()
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
        backgroundImage: data.backgroundImage,
        ...datasource,
        properties: {
          hintText: planet === 'the sun' ? 'tell me about it.' : 'how far away is it?'
        },
        transformers: [{ inputPath: 'hintText', outputName: 'hint', transformer: 'textToHint' }]
      }
    }
  };
};
