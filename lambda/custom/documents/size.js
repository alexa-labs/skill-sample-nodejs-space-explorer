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
        { name: 'alexa-layouts', version: '1.0.0-beta' },
        { name: 'alexa-styles', version: '1.0.0-beta' },
        { name: 'layouts', version: '1.0.0', source: `${cdnPath}apl/layouts.json` },
        { name: 'styles', version: '1.0.0', source: `${cdnPath}apl/styles.json` }
      ],
      resources: [{ strings: { fontFamilyRomanSans: 'amazon-ember-display' } }],
      mainTemplate: {
        parameters: ['payload'],
        item: {
          type: 'Frame',
          backgroundColor: 'black',
          items: [
            {
              when: '${@viewportProfile == @hubRoundSmall}',
              type: 'Container',
              direction: 'column',
              height: '100%',
              width: '100%',
              items: [
                {
                  type: 'Image',
                  source: '${payload.data.properties.backgroundImage}',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  scale: 'best-fill'
                },
                {
                  type: 'Container',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  item: {
                    type: 'AlexaHeader',
                    headerTitle: 'SIZE',
                    headerAttributionPrimacy: false,
                    headerBackButton: 1,
                    headerNavigationAction: 'backEvent'
                  }
                },
                {
                  type: 'Pager',
                  items: [
                    {
                      type: 'Container',
                      direction: 'column',
                      alignItems: 'center',
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center',
                      items: [
                        {
                          type: 'PlanetSize',
                          paddingTop: 20,
                          planet: '${payload.data.properties.planets[0].label}',
                          color: '${payload.data.properties.planets[0].color}',
                          diameter: '${payload.data.properties.planets[0].diameter}'
                        },
                        {
                          type: 'PlanetSize',
                          paddingTop: 20,
                          planet: '${payload.data.properties.planets[1].label}',
                          color: '${payload.data.properties.planets[1].color}',
                          diameter: '${payload.data.properties.planets[1].diameter}'
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
                              position: 'absolute',
                              width: '${payload.data.properties.planets[0].scale * 55}vh',
                              height: '${payload.data.properties.planets[0].scale * 55}vh',
                              backgroundColor: '${payload.data.properties.planets[0].color}',
                              borderRadius: '1000'
                            },
                            {
                              type: 'Frame',
                              position: 'absolute',
                              width: '${payload.data.properties.planets[1].scale * 55}vh',
                              height: '${payload.data.properties.planets[1].scale * 55}vh',
                              backgroundColor: '${payload.data.properties.planets[1].color}',
                              borderRadius: '1000'
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
              type: 'Container',
              direction: 'column',
              height: '100%',
              width: '100%',
              items: [
                {
                  type: 'Image',
                  source: '${payload.data.properties.backgroundImage}',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  scale: 'best-fill'
                },
                {
                  type: 'AlexaHeader',
                  headerTitle: '${payload.data.properties.title}',
                  headerBackButton: 1,
                  headerNavigationAction: 'backEvent'
                },
                {
                  type: 'Container',
                  grow: 1,
                  shrink: 1,
                  paddingLeft: '@marginLeft',
                  paddingRight: '@marginRight',
                  direction: 'row',
                  align: 'center',
                  justifyContent: 'spaceBetween',
                  items: [
                    {
                      type: 'Container',
                      width: '50%',
                      paddingRight: '${@marginRight/2}',
                      justifyContent: 'spaceAround',
                      items: [
                        {
                          type: 'PlanetSize',
                          planet: '${payload.data.properties.planets[0].label}',
                          color: '${payload.data.properties.planets[0].color}',
                          diameter: '${payload.data.properties.planets[0].diameter}'
                        },
                        {
                          when: planet1 !== planet2,
                          type: 'PlanetSize',
                          planet: '${payload.data.properties.planets[1].label}',
                          color: '${payload.data.properties.planets[1].color}',
                          diameter: '${payload.data.properties.planets[1].diameter}'
                        },
                        {
                          when: planet1 !== planet2,
                          type: 'Container',
                          items: [
                            {
                              when:
                                '${(@viewportProfile == @hubLandscapeMedium && viewport.height > 600) || @viewportProfile != @hubLandscapeMedium}',
                              type: 'Text',
                              text: '${payload.data.properties.comparisonString}',
                              style:
                                "${viewport.height <= 600 ? 'textStyleBody' : 'textStyleHeadline'}"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: 'Container',
                      width: '50%',
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
                              position: 'absolute',
                              width:
                                '${viewport.height <= 600 ? payload.data.properties.planets[0].scale * 53 : payload.data.properties.planets[0].scale * 65}vh',
                              height:
                                '${viewport.height <= 600 ? payload.data.properties.planets[0].scale * 53 : payload.data.properties.planets[0].scale * 65}vh',
                              backgroundColor: '${payload.data.properties.planets[0].color}',
                              borderRadius: '1000'
                            },
                            {
                              when: planet1 !== planet2,
                              type: 'Frame',
                              position: 'absolute',
                              width:
                                '${viewport.height <= 600 ? payload.data.properties.planets[1].scale * 53 : payload.data.properties.planets[1].scale * 65}vh',
                              height:
                                '${viewport.height <= 600 ? payload.data.properties.planets[1].scale * 53 : payload.data.properties.planets[1].scale * 65}vh',
                              backgroundColor: '${payload.data.properties.planets[1].color}',
                              borderRadius: '1000'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                { type: 'AlexaFooter', hintText: '${payload.data.properties.hint}' }
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
          backgroundImage: 'https://s3-us-west-2.amazonaws.com/ddg-skill/assets/bg_space.jpg',
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
