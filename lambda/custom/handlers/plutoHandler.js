/*
 * Copyright 2018 Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * 
 * Licensed under the Amazon Software License (the License).
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 * 
 * http: //aws.amazon.com/asl/
 * 
 * or in the license file accompanying this file. This file is distributed
 * on an AS IS BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

const Handler = require('../helpers/handler');
const data = require('../data/planets.json');
const TranscriptDirective = require('../documents/transcript');
const speakDirective = require('../documents/speakDirective');

const PlutoRequestHandler = Handler('PlutoIntent', handlerInput => {
  const index = Math.floor(Math.random() * 4);

  const attributes = handlerInput.attributesManager.getSessionAttributes();
  const location = attributes.location || 'solar system';

  if (
    attributes.previousLocation &&
    attributes.previousLocation[attributes.previousLocation.length - 1] !== location
  ) {
    attributes.previousLocation.push(location);
  }

  if (!attributes.previousLocation) {
    attributes.previousLocation = ['solar system'];
  }

  handlerInput.attributesManager.setSessionAttributes(attributes);

  return handlerInput.responseBuilder
    .addDirective(
      TranscriptDirective(
        {
          image: data.pluto.about.images[index],
          title: "Pluto's Fate",
          source: 'NASA',
          description:
            'In 2006, after the discovery of more massive objects in the distant region of our solar system known as the Kuiper Belt, the official definition of the term "planet" was revised. This revision excluded Pluto, which was reclassified as a dwarf planet.'
        },
        'LEARN MORE'
      )
    )
    .addDirective(speakDirective())
    .getResponse();
});

module.exports = PlutoRequestHandler;
