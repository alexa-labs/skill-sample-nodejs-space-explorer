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

const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

module.exports = (planet1, planet2) => {
  const elements = [];
  const diffString = Math.abs(
    planetData[planet1].distance - planetData[planet2].distance
  ).toLocaleString();

  Object.keys(planetData).forEach(k => {
    if (k !== 'the sun' && k !== 'backgroundImage') {
      const item = planetData[k];
      let itemWidth = Math.min(
        (item.distance / planetData[planet1 === 'pluto' || planet2 === 'pluto' ? 'pluto' : 'neptune'].distance) * 100 + 3,
        100
      );

      if (k !== 'pluto' || ((planet1 === 'pluto' || planet2 === 'pluto') && k === 'pluto')) {
        elements.push({
          when: `\${(@viewportProfile != @hubLandscapeMedium && @viewportProfile != @hubLandscapeSmall) || ${(k === planet1 || k === planet2) || (planets.indexOf(k) === planets.indexOf(planet1) + 1 || planets.indexOf(k) === planets.indexOf(planet1) - 1)}}`,
          type: 'DistanceGraphic',
          id: `distance_${k}`,
          color: item.color,
          width: Math.round(itemWidth),
          name: k,
          active: k === planet1 || k === planet2
        })
      }
    }
  });

  elements.sort((a, b) => a.width - b.width);

  return {
    type: 'Alexa.Presentation.APL.RenderDocument',
    token: 'distance',
    document: {
      type: 'APL',
      version: '1.0',
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
        DistanceReveal: {
          parameters: [ 'componentId' ],
          command: {
            type: 'AnimateItem',
            componentId: '${componentId}',
            easing: '@alexa-out',
            delay: 250,
            duration: '${10 * width}',
            value: [
              {
                property: 'transform',
                from: {
                  translateX: '-100%'
                },
                to: {
                  translateX: '0%'
                }
              }
            ]
          } 
        },
        onLoad: {
          parameters: [],
          command: {
            type: 'Parallel',
            commands: [
              {
                type: 'SoftStaggerBackgroundTargetted',
                componentId: 'background'
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
                componentId: 'distanceText',
                fromDirection: 'bottom',
                order: 1
              },
              {
                type: 'SoftStaggerItemTargetted',
                componentId: 'sunlightText',
                fromDirection: 'bottom',
                order: 2
              },
              {
                type: 'DistanceReveal',
                componentId: 'distance_mercury'
              },
              {
                type: 'DistanceReveal',
                componentId: 'distance_venus'
              },
              {
                type: 'DistanceReveal',
                componentId: 'distance_earth'
              },
              {
                type: 'DistanceReveal',
                componentId: 'distance_mars'
              },
              {
                type: 'DistanceReveal',
                componentId: 'distance_jupiter'
              },
              {
                type: 'DistanceReveal',
                componentId: 'distance_saturn'
              },
              {
                type: 'DistanceReveal',
                componentId: 'distance_uranus'
              },
              {
                type: 'DistanceReveal',
                componentId: 'distance_neptune'
              },
              {
                type: 'DistanceReveal',
                componentId: 'distance_pluto'
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
          item: [
            {
              when: '${@viewportProfile == @hubRoundSmall}',
              type: 'Container',
              direction: 'column',
              height: '100%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              items: [
                {
                  type: 'AlexaBackground',
                  backgroundImageSource: '${payload.data.properties.planetData.backgroundImage}'
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
                  headerTitle: 'DISTANCE',
                  headerAttributionPrimacy: false,
                  width: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  opacity: 0
                },
                {
                  type: 'Container',
                  width: '100%',
                  height: '100%',
                  direction: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  items: [
                    {
                      type: 'Container',
                      id: 'distanceText',
                      direction: 'column',
                      alignItems: 'center',
                      opacity: 0,
                      items: [
                        {
                          type: 'Text',
                          style: 'textStyleCallout',
                          spacing: 10,
                          opacity: 0.6,
                          text: `DISTANCE FROM ${planet2.toUpperCase()}`
                        },
                        {
                          type: 'Text',
                          text: `${diffString} mi`,
                          style: 'textStyleDisplay4'
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
              width: '100%',
              height: '100%',
              items: [
                {
                  type: 'AlexaBackground',
                  id: 'background',
                  backgroundImageSource: planetData.backgroundImage,
                  opacity: 0
                },
                {
                  type: 'AlexaHeader',
                  headerTitle: `${planet1.toUpperCase()} · DISTANCE`,
                  headerBackButton: true,
                  headerNavigationAction: 'backEvent',
                  id: 'header',
                  opacity: 0
                },
                {
                  type: 'Container',
                  width: '100%',
                  grow: 1,
                  shrink: 1,
                  paddingLeft: '6vw',
                  paddingRight: '6vw',
                  justifyContent: 'spaceAround',
                  items: elements.concat([
                    {
                      type: 'Container',
                      direction: 'row',
                      width: '100%',
                      alignItems: 'center',
                      spacing: '48dp',
                      items: [
                        {
                          type: 'Container',
                          id: 'distanceText',
                          opacity: 0,
                          items: [
                            {
                              type: 'Text',
                              style: 'textStyleCallout',
                              opacity: 0.6,
                              text: `DISTANCE FROM ${planet2.toUpperCase()}`
                            },
                            {
                              type: 'Text',
                              style: 'textStyleDisplay4',
                              text: `${diffString} mi`
                            }
                          ]
                        },
                        {
                          when: `\${viewport.height > 600 && ${planet2 ===
                            'the sun'}}`,
                          type: 'Container',
                          spacing: '68dp',
                          id: 'sunlightText',
                          opacity: 0,
                          items: [
                            {
                              type: 'Text',
                              style: '${@viewportProfileCategory == @tvLandscape ? \'textStyleBody\' : \'textStyleCallout\'}',
                              opacity: 0.6,
                              text: 'SUNLIGHT TO TRAVEL'
                            },
                            {
                              type: 'Text',
                              style: '${@viewportProfileCategory == @tvLandscape ? \'textStyleDisplay2\' : \'textStyleDisplay4\'}',
                              text: `\${payload.data.properties.planetData['${planet1}'].lightTravel + ' minutes'}`
                            }
                          ]
                        }
                      ]
                    }
                  ])
                },
                {
                  type: 'AlexaFooter',
                  id: 'footer',
                  opacity: 0,
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
          hintText: 'how far away is Neptune?',
          planet2,
          planetData
        },
        transformers: [
          {
            inputPath: 'hintText',
            outputName: 'hint',
            transformer: 'textToHint'
          }
        ]
      }
    }
  };
};
