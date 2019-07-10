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

const planetData = require('../data/planets.json');
const cdnPath = require('../helpers/cdn-path');

function capitalize(string) {
  const arr = string.split('');

  arr[0] = arr[0].toUpperCase();
  return arr.join('');
}

module.exports = (planet1, planet2, comparator) => {
  const big = (planetData[planet1].diameter > planetData[planet2].diameter
    ? planet1
    : planet2
  ).toLowerCase();
  const small = (big === planet1 ? planet2 : planet1).toLowerCase();

  return {
    type: 'Alexa.Presentation.APL.RenderDocument',
    token: 'object-size',
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
        },
        {
          name: 'soft-stagger',
          version: '1.0.0',
          source: `${cdnPath}apl/soft-stagger.json`
        }
      ],
      commands: {
        planetIn: {
          parameters: [ 'componentId', 'delay', 'order' ],
          command: {
            type: 'AnimateItem',
            componentId: '${componentId}',
            delay: '${delay}',
            duration: 666,
            easing: '@alexa-in-out',
            value: [
              {
                property: 'opacity',
                from: 0,
                to: 1
              },
              {
                property: 'transform',
                from: [
                  {
                    transformY: '${in == \'top\' ? -50% : 50%}'
                  },
                  {
                    scale: 0
                  }
                ],
                to: [
                  {
                    transformY: 0
                  },
                  {
                    scale: 1
                  }
                ]
              }
            ]
          }
        },
        onLoad: {
          command: {
            type: 'Parallel',
            commands: [
              {
                type: 'SoftStaggerBackgroundTargetted',
                componentId: 'background'
              },
              {
                type: 'SoftStaggerChromeTargetted',
                componentId: 'header'
              },
              {
                type: 'SoftStaggerHintTargetted',
                componentId: 'footer'
              },
              {
                type: 'SoftStaggerItemTargetted',
                componentId: 'planetData1',
                fromDirection: 'bottom',
                order: 1
              },
              {
                type: 'SoftStaggerItemTargetted',
                componentId: 'planetData2',
                fromDirection: 'bottom',
                order: 2
              },
              {
                type: 'AnimateItem',
                componentId: 'planetGraphic1',
                duration: 1000,
                easing: 'linear',
                value: [
                  {
                    property: 'opacity',
                    from: 0,
                    to: 1
                  },
                  {
                    property: 'transform',
                    from: [
                      {
                        translateY: '-50%'
                      },
                      {
                        scale: 0
                      }
                    ],
                    to: [
                      {
                        translateY: 0
                      },
                      {
                        scale: 1
                      }
                    ]
                  }
                ]
              },
              {
                type: 'AnimateItem',
                componentId: 'planetGraphic2',
                duration: 1000,
                easing: 'linear',
                value: [
                  {
                    property: 'opacity',
                    from: 0,
                    to: 1
                  },
                  {
                    property: 'transform',
                    from: [
                      {
                        translateY: '50%'
                      },
                      {
                        scale: 0
                      }
                    ],
                    to: [
                      {
                        translateY: 0
                      },
                      {
                        scale: 1
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      },
      onMount: [
        {
          type: 'onLoad'
        }
      ],
      mainTemplate: {
        parameters: ['payload'],
        item: {
          type: 'Frame',
          backgroundColor: 'black',
          items: [
            {
              type: 'Container',
              direction: 'column',
              height: '100%',
              width: '100%',
              items: [
                {
                  type: 'AlexaBackground',
                  id: 'background',
                  backgroundImageSource: '${payload.data.properties.backgroundImage}',
                  opacity: 0
                },
                {
                  when: '${@viewportProfile != @hubRoundSmall}',
                  type: 'AlexaHeader',
                  id: 'header',
                  headerTitle: 'SIZE',
                  headerAttributionPrimacy: false,
                  headerBackButton: true,
                  width: '100%',
                  opacity: 0
                },
                {
                  when: '${@viewportProfile == @hubRoundSmall}',
                  type: 'AlexaHeader',
                  id: 'header',
                  headerTitle: 'SIZE',
                  headerAttributionPrimacy: false,
                  headerBackButton: true,
                  width: '100%',
                  opacity: 0,
                  position: 'absolute',
                  left: 0
                },
                {
                  when: '${@viewportProfile == @hubRoundSmall}',
                  type: 'Pager',
                  grow: 1,
                  height: '100%',
                  width: '100%',
                  onPageChanged: [
                    {
                      when: '${event.source.value == 0}',
                      type: "Parallel",
                      commands: [
                        {
                          type: 'SoftStaggerItemTargetted',
                          order: 1,
                          componentId: 'planetData1',
                          fromDirection: "left"
                        },
                        {
                          type: 'SoftStaggerItemTargetted',
                          order: 2,
                          componentId: 'planetData2',
                          fromDirection: "left"
                        },
                        {
                          type: 'SoftStaggerOutTargetted',
                          componentId: 'planetGraphic1'
                        },
                        {
                          type: 'SoftStaggerOutTargetted',
                          componentId: 'planetGraphic2'
                        }
                      ]
                    },
                    {
                      when: '${event.source.value == 1}',
                      type: "Parallel",
                      commands: [
                        {
                          type: 'SoftStaggerOutTargetted',
                          componentId: 'planetData1'
                        },
                        {
                          type: 'SoftStaggerOutTargetted',
                          componentId: 'planetData2'
                        },
                        {
                          type: 'SoftStaggerItemTargetted',
                          order: 1,
                          componentId: 'planetGraphic1',
                          fromDirection: "right"
                        },
                        {
                          type: 'SoftStaggerItemTargetted',
                          order: 2,
                          componentId: 'planetGraphic2',
                          fromDirection: "right"
                        }
                      ]
                    }
                  ],
                  items: [
                    {
                      type: 'Container',
                      width: '100%',
                      height: '100%',
                      direction: 'column',
                      alignItems: 'start',
                      justifyContent: 'center',
                      items: [
                        {
                          type: 'PlanetSize',
                          id: 'planetData1',
                          paddingTop: 20,
                          paddingLeft: '@marginHorizontal',
                          planet: '${payload.data.properties.planets[0].label}',
                          color: '${payload.data.properties.planets[0].color}',
                          diameter: '${payload.data.properties.planets[0].diameter}',
                          opacity: 0
                        },
                        {
                          type: 'PlanetSize',
                          id: 'planetData2',
                          paddingTop: 20,
                          paddingLeft: '@marginHorizontal',
                          planet: '${payload.data.properties.planets[1].label}',
                          color: '${payload.data.properties.planets[1].color}',
                          diameter: '${payload.data.properties.planets[1].diameter}',
                          opacity: 0
                        }
                      ]
                    },
                    {
                      type: 'Container',
                      width: '100%',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      items: [
                        {
                          type: 'Container',
                          width: '60%',
                          height: '60%',
                          alignItems: 'center',
                          justifyContent: 'end',
                          direction: 'column',
                          items: [
                            {
                              type: 'Frame',
                              id: 'planetGraphic1',
                              position: 'absolute',
                              width: '${payload.data.properties.planets[0].scale * 55}vh',
                              height: '${payload.data.properties.planets[0].scale * 55}vh',
                              backgroundColor: '${payload.data.properties.planets[0].color}',
                              borderRadius: '1000',
                              opacity: 0
                            },
                            {
                              type: 'Frame',
                              id: 'planetGraphic2',
                              position: 'absolute',
                              width: '${payload.data.properties.planets[1].scale * 55}vh',
                              height: '${payload.data.properties.planets[1].scale * 55}vh',
                              backgroundColor: '${payload.data.properties.planets[1].color}',
                              borderRadius: '1000',
                              opacity: 0
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  when: '${@viewportProfile != @hubRoundSmall}',
                  type: 'Container',
                  grow: 1,
                  shrink: 1,
                  paddingLeft: '@marginHorizontal',
                  paddingRight: '@marginHorizontal',
                  direction: 'row',
                  align: 'center',
                  justifyContent: 'spaceBetween',
                  items: [
                    {
                      type: 'Container',
                      width: '${viewport.width < 1000 ? \'60%\' : \'50%\'}',
                      paddingRight: '@spacingMedium',
                      justifyContent: 'spaceAround',
                      items: [
                        {
                          type: 'PlanetSize',
                          id: 'planetData1',
                          planet: '${payload.data.properties.planets[0].label}',
                          color: '${payload.data.properties.planets[0].color}',
                          diameter: '${payload.data.properties.planets[0].diameter}',
                          opacity: 0
                        },
                        {
                          when: planet1 !== planet2,
                          type: 'PlanetSize',
                          id: 'planetData2',
                          paddingTop: '@spacingSmall',
                          planet: '${payload.data.properties.planets[1].label}',
                          color: '${payload.data.properties.planets[1].color}',
                          diameter: '${payload.data.properties.planets[1].diameter}',
                          opacity: 0
                        },
                        {
                          when: planet1 !== planet2,
                          type: 'Container',
                          id: 'planetData3',
                          paddingTop: '@spacingMedium',
                          items: [
                            {
                              when:
                                '${viewport.height > 600 || @viewportProfile != @hubLandscapeMedium}',
                              type: 'Text',
                              text: '${payload.data.properties.comparisonString}',
                              style: 'textStyleTitle',
                              opacity: 0
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: 'Container',
                      width: '${viewport.width < 1000 ? \'40%\' : \'50%\'}',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      items: [
                        {
                          type: 'Container',
                          height:
                            '${viewport.height <= 600 ? payload.data.properties.planets[0].scale * 53 : payload.data.properties.planets[0].scale * 65}vh',
                          width:
                            '${viewport.height <= 600 ? payload.data.properties.planets[0].scale * 53 : payload.data.properties.planets[0].scale * 65}vh',
                          alignItems: 'center',
                          justifyContent: 'end',
                          direction: 'column',
                          items: [
                            {
                              type: 'Frame',
                              id: 'planetGraphic1',
                              position: 'absolute',
                              width:
                                '${viewport.height <= 600 ? payload.data.properties.planets[0].scale * 53 : payload.data.properties.planets[0].scale * 65}vh',
                              height:
                                '${viewport.height <= 600 ? payload.data.properties.planets[0].scale * 53 : payload.data.properties.planets[0].scale * 65}vh',
                              backgroundColor: '${payload.data.properties.planets[0].color}',
                              borderRadius: 1000,
                              opacity: 0,
                              transform: [
                                {
                                  translateX: '50%'
                                }
                              ]
                            },
                            {
                              when: planet1 !== planet2,
                              type: 'Frame',
                              id: 'planetGraphic2',
                              position: 'absolute',
                              width:
                                '${viewport.height <= 600 ? payload.data.properties.planets[1].scale * 53 : payload.data.properties.planets[1].scale * 65}vh',
                              height:
                                '${viewport.height <= 600 ? payload.data.properties.planets[1].scale * 53 : payload.data.properties.planets[1].scale * 65}vh',
                              backgroundColor: '${payload.data.properties.planets[1].color}',
                              borderRadius: 1000,
                              opacity: 0,
                              transform: [
                                {
                                  translateX: '50%'
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  when: '${@viewportProfile != @hubRoundSmall}',
                  type: 'AlexaFooter',
                  id: 'footer',
                  hintText: '${payload.data.properties.hint}'
                }
              ]
            }
          ]
        }
      }
    },
    datasources: {
      data: {
        type: 'object',
        properties: {
          title: `${planet1.toUpperCase()} · SIZE`,
          hintText: 'how big is Saturn?',
          backgroundImage: `${cdnPath}assets/bg_space.jpg`,
          comparisonString: `${capitalize(planet1)} is ${comparator} than ${capitalize(planet2)}`,
          planets: [
            {
              label: big.toUpperCase(),
              diameter: `${planetData[big].diameter.toLocaleString()} mi`,
              scale: 1,
              color: planetData[big].color,
              zIndex: 0
            },
            {
              label: small.toUpperCase(),
              diameter: `${planetData[small].diameter.toLocaleString()} mi`,
              scale: parseFloat((planetData[small].diameter / planetData[big].diameter).toFixed(2)),
              color: planetData[small].color,
              zIndex: 1
            }
          ]
        },
        transformers: [{ inputPath: 'hintText', outputName: 'hint', transformer: 'textToHint' }]
      }
    }
  };
};
