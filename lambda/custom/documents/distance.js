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

      if (k !== 'pluto' || ((planet1 === 'pluto' || planet2 === 'pluto') && k === 'pluto')) {
        elements.push({
          when: `\${@viewportProfile != @hubLandscapeMedium || ${k === planet1 ||
            k === planet2 ||
            (planets.indexOf(k) === planets.indexOf(planet1) + 1 ||
              planets.indexOf(k) === planets.indexOf(planet1) - 1)}}`,
          type: 'DistanceGraphic',
          color: item.color,
          width: Math.min(
            (item.distance /
              planetData[planet1 === 'pluto' || planet2 === 'pluto' ? 'pluto' : 'neptune']
                .distance) *
              100 +
              3,
            100
          ),
          name: k,
          active: k === planet1 || k === planet2
        });
      }
    }
  });

  elements.sort((a, b) => a.width - b.width);

  return {
    type: 'Alexa.Presentation.APL.RenderDocument',
    token: 'atmospheric-composition',
    document: {
      type: 'APL',
      version: '1.0',
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
                  type: 'Image',
                  source: planetData[planet1].image,
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  scale: 'best-fit'
                },
                {
                  type: 'Image',
                  source: 'https://s3-us-west-2.amazonaws.com/ddg-skill/assets/rook-full-scrim.png',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  scale: 'best-fit'
                },
                {
                  type: 'Container',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  item: {
                    type: 'AlexaHeader',
                    headerTitle: 'DISTANCE',
                    headerAttributionPrimacy: false
                  }
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
                      direction: 'column',
                      alignItems: 'center',
                      items: [
                        {
                          type: 'Text',
                          style: 'textStyleLabel',
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
                  type: 'Image',
                  position: 'absolute',
                  width: '100vw',
                  height: '100vh',
                  scale: 'best-fill',
                  source: planetData.backgroundImage
                },
                {
                  type: 'AlexaHeader',
                  headerTitle: `${planet1.toUpperCase()} · DISTANCE`,
                  headerBackButton: 1,
                  headerNavigationAction: 'backEvent'
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
                      // "paddingTop": "20dp",
                      width: '100%',
                      alignItems: 'center',
                      spacing: '48dp',
                      items: [
                        {
                          type: 'Container',
                          items: [
                            {
                              type: 'Text',
                              style: 'textStyleDetail',
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
                          when: `\${((@viewportProfile == @hubLandscapeMedium && viewport.height > 600) || @viewportProfile != @hubLandscapeMedium) && ${planet2 ===
                            'the sun'}}`,
                          type: 'Container',
                          spacing: '68dp',
                          items: [
                            {
                              type: 'Text',
                              style: 'textStyleDetail',
                              opacity: 0.6,
                              text: 'SUNLIGHT TO TRAVEL'
                            },
                            {
                              type: 'Text',
                              style: 'textStyleDisplay4',
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
