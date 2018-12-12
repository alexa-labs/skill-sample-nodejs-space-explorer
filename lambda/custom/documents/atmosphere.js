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

module.exports = (planet, comp) => {
  const elements = [];
  const pagerItems = [];

  if (comp) {
    comp.forEach(item => {
      elements.push({
        type: 'Element',
        element: item.element,
        title: item.element.toUpperCase(),
        notation: `\${payload.data.properties.elements['${item.element}'].notation}`,
        color: `\${payload.data.properties.elements['${item.element}'].color}`,
        percentage: item.percentage,
        spacing: '32dp'
      });
    });
  }

  elements.forEach(item => {
    pagerItems.push({
      type: 'Container',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      paddingLeft: '6vw',
      paddingRight: '6vw',
      paddingTop: 50,
      direction: 'row',
      item
    });
  });

  return {
    type: 'Alexa.Presentation.APL.RenderDocument',
    token: 'atmospheric-composition',
    document: {
      type: 'APL',
      version: '1.0',
      import: [
        {
          name: 'alexa-layouts',
          version: '1.0.0-beta'
        },
        {
          name: 'alexa-styles',
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
      features: {
        idleTimeout: 60000
      },
      mainTemplate: {
        parameters: ['payload'],
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
                position: 'absolute',
                width: '100%',
                height: '100%',
                scale: 'best-fill',
                source: planetData.backgroundImage
              },
              {
                type: 'Container',
                position: 'absolute',
                width: '100%',
                height: '100%',
                item: {
                  type: 'AlexaHeader',
                  headerTitle: 'ATMOSPHERE',
                  headerAttributionPrimacy: false
                }
              },
              {
                type: 'Pager',
                width: '100%',
                height: '100%',
                items: [
                  ...pagerItems,
                  {
                    when: elements.length === 0,
                    type: 'Container',
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    item: {
                      type: 'Text',
                      style: 'textStyleDisplay3',
                      textAlign: 'center',
                      text: `${capitalize(planet)} has no atmosphere`
                    }
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
            alignItems: 'center',
            justifyContent: 'center',
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
                headerTitle: `${planet.toUpperCase()} · ATMOSPHERE`,
                headerBackButton: 1,
                headerNavigationAction: 'backEvent',
                "width": "100%",
              },
              {
                when: '${@viewportProfile != @tvLandscapeXLarge}',
                type: 'Container',
                alignItems: 'center',
                justifyContent: 'spaceAround',
                width: '100%',
                height: '70%',
                paddingLeft: '6vw',
                paddingRight: '6vw',
                direction: 'row',
                items: [
                  ...elements,
                  {
                    when: elements.length === 0,
                    type: 'Text',
                    style: 'textStyleDisplay3',
                    textAlign: 'center',
                    text: `${capitalize(planet)} has no atmosphere`
                  }
                ]
              },
              {
                when: '${@viewportProfile == @tvLandscapeXLarge}',
                type: 'Container',
                width: '100%',
                height: '70%',
                paddingLeft: '@marginLeft',
                paddingRight: '@marginRight',
                direction: 'row',
                justifyContent: 'spaceBetween',
                alignItems: 'start',
                items: [
                  {
                    when: elements.length !== 0,
                    type: 'Container',
                    width: '50%',
                    height: '100%',
                    direction: 'column',
                    spacing: '@spacingLarge',
                    items: [
                      {
                        type: 'Sequence',
                        width: '100%',
                        height: '100%',
                        items: elements
                      }
                    ]
                  },
                  {
                    when: elements.length !== 0,
                    type: 'Container',
                    width: '40%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    items: [
                      {
                        type: 'Image',
                        width: '100%',
                        height: '100%',
                        scale: 'best-fit',
                        source: planetData[planet].atmosphereImage
                      }
                    ]
                  },
                  {
                    when: elements.length === 0,
                    type: 'Container',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    items: [
                      {
                        type: 'Text',
                        style: 'textStyleDisplay4',
                        text: `${capitalize(planet)} has no atmosphere`,
                        textAlign: 'center'
                      }
                    ]
                  }
                ]
              },
              {
                type: 'AlexaFooter',
                hintText: '${payload.data.properties.hint}'
              }
            ]
          }
        ]
      }
    },
    datasources: {
      data: {
        type: 'object',
        properties: {
          hintText: "what's in Earth's atmosphere?",
          elements: {
            argon: {
              notation: 'Ar',
              color: '#893592'
            },
            'carbon dioxide': {
              notation: 'CO<sub>2</sub>',
              color: '#d94623'
            },
            helium: {
              notation: 'He',
              color: '#b83b5e'
            },
            hydrogen: {
              notation: 'H',
              color: '#3875bb'
            },
            methane: {
              notation: 'CH<sub>4</sub>',
              color: '#df7140'
            },
            nitrogen: {
              notation: 'N<sub>2</sub>',
              color: '#339b9e'
            },
            oxygen: {
              notation: 'O<sub>2</sub>',
              color: '#699b30'
            },
            sodium: {
              notation: 'Na',
              color: '#a0a0a0'
            },
            potassium: {
              notation: 'K',
              color: '#f0f000'
            }
          }
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
