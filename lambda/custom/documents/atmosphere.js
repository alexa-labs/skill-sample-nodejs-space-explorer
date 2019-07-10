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
        id: item.element.replace(/\s/g, '_'),
        element: item.element,
        title: item.element.toUpperCase(),
        notation: `\${payload.data.properties.elements['${item.element}'].notation}`,
        color: `\${payload.data.properties.elements['${item.element}'].color}`,
        percentage: item.percentage,
        spacing: '32dp'
      });
    });
  }

  elements.forEach((item, i) => {
    pagerItems.push({
      type: 'Container',
      alignItems: 'center',
      id: `page_${i}`,
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      paddingLeft: '6vw',
      paddingRight: '6vw',
      paddingTop: 50,
      direction: 'row',
      opacity: i === 0 ? 1 : 0,
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
        },
        {
          name: 'atmosphere-graphics',
          version: '1.0.0',
          source: `${cdnPath}apl/atmosphere-graphics.json`
        }
      ],
      commands: {
        onLoad: {
          parameters: [],
          command: {
            type: 'Parallel',
            delay: 250,
            commands: [
              ...elements.map((item, i) => {
                return {
                  type: 'SoftStaggerItemTargetted',
                  componentId: item.id,
                  order: i + 1,
                  fromDirection: 'bottom'
                }
              }),
              {
                type: 'SoftStaggerItemTargetted',
                componentId: 'compositionImage',
                order: elements.length,
                fromDirection: 'right'
              },
              {
                type: 'SoftStaggerBackgroundTargetted',
                componentId: 'background'
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
        items: [
          {
            type: 'Container',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            items: [
              {
                type: 'AlexaBackground',
                id: 'background',
                backgroundImageSource: planetData.backgroundImage,
                backgroundScale: 'best-fill',
                opacity: 0
              },
              {
                when: '${@viewportProfile != @hubRoundSmall}',
                type: 'AlexaHeader',
                id: 'header',
                headerTitle: `${planet.toUpperCase()} · ATMOSPHERE`,
                headerBackButton: true,
                width: '100%',
                opacity: 0
              },
              {
                when: '${@viewportProfile == @hubRoundSmall}',
                type: 'AlexaHeader',
                id: 'header',
                headerTitle: `${planet.toUpperCase()} · ATMOSPHERE`,
                headerBackButton: true,
                headerAttributionPrimacy: false,
                width: '100%',
                opacity: 0,
                position: 'absolute',
                top: 0,
                left: 0
              },
              {
                when: '${@viewportProfile == @hubRoundSmall}',
                type: 'Pager',
                id: 'pager',
                width: '100%',
                height: '100%',
                bind: [
                  {
                    name: 'currentPage',
                    value: 0
                  }
                ],
                onPageChanged: [
                  {
                    type: 'Parallel',
                    commands: [
                      {
                        type: 'SoftStaggerItemTargetted',
                        componentId: '${\'page_\' + event.source.value}',
                        order: 2,
                        fromDirection: '${event.source.value < currentPage ? \'left\' : \'right\'}'
                      },
                      {
                        type: 'SoftStaggerOutTargetted',
                        componentId: '${\'page_\' + currentPage}'
                      }
                    ]
                  },
                  {
                    type: 'SetValue',
                    componentId: 'pager',
                    property: 'currentPage',
                    value: '${event.source.value}'
                  }
                ],
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
              },
              {
                when: '${@viewportProfile == @tvLandscapeXLarge}',
                type: 'Container',
                width: '100%',
                height: '70%',
                paddingLeft: '@marginHorizontal',
                paddingRight: '@marginHorizontal',
                direction: 'row',
                justifyContent: 'spaceBetween',
                alignItems: 'start',
                items: [
                  {
                    when: elements.length !== 0,
                    type: 'Container',
                    id: 'listContainer',
                    width: '50%',
                    height: '100%',
                    direction: 'column',
                    spacing: '@spacingLarge',
                    opacity: 0,
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
                    id: 'compositionImage',
                    width: '40%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    items: [
                      {
                        type: 'VectorGraphic',
                        width: '100%',
                        height: '100%',
                        scale: 'best-fit',
                        source: `${planet}_atmo`
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
                when: '${@viewportProfile != @tvLandscapeXLarge && @viewportProfile != @hubRoundSmall}',
                type: 'Container',
                alignItems: 'center',
                justifyContent: 'spaceAround',
                width: '100%',
                grow: 1,
                paddingLeft: '@marginHorizontal',
                paddingRight: '@marginHorizontal',
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
                when: '${@viewportProfile != @hubRoundSmall}',
                type: 'AlexaFooter',
                id: 'footer',
                opacity: 0,
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
