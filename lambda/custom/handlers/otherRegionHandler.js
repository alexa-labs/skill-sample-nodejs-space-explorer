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

const data = {
  'kuiper belt': {
    image: 'https://s3-us-west-2.amazonaws.com/ddg-skill/kuiper_belt.jpeg',
    description:
      'The Kuiper Belt is a disc-shaped region beyond Neptune that extends from about 30 to 55 astronomical units (compared to Earth which is one astronomical unit, or AU, from the Sun). Comets from the Kuiper Belt, known as short period comets, take less than 200 years to orbit the Sun and travel approximately in the plane in which most of the planets orbit the Sun. There may be hundreds of thousands of icy bodies and a trillion or more comets in this distant region of our solar system.'
  },
  'oort cloud': {
    image: 'https://s3-us-west-2.amazonaws.com/ddg-skill/oort_cloud.jpeg',
    description:
      "The Oort Cloud lies far beyond Pluto and the most distant edges of the Kuiper Belt. While the planets of our solar system orbit in a flat plane, the Oort Cloud is believed to be a giant spherical shell surrounding the Sun, planets, and Kuiper Belt Objects. It is like a big, thick bubble around our solar system. The Oort Cloud's icy bodies can be as large as mountains — and sometimes larger."
  },
  'asteroid belt': {
    image: 'https://s3-us-west-2.amazonaws.com/ddg-skill/asteroid_belt.jpeg',
    description:
      'Asteroids are rocky, airless worlds that orbit our Sun, but are too small to be called planets. Tens of thousands of these minor planets are gathered in the main asteroid belt, a vast doughnut-shaped ring between the orbits of Mars and Jupiter. Asteroids that pass close to Earth—and merit close watch—are called Near-Earth Objects, or NEOs.'
  }
};

const Handler = require('../helpers/handler');
const TranscriptDirective = require('../documents/transcript');

function capitalize(string) {
  const words = string.split(' ');
  words[0] = words[0].split('');
  words[1] = words[1].split('');

  words[0][0] = words[0][0].toUpperCase();
  words[1][0] = words[1][0].toUpperCase();

  words[0] = words[0].join('');
  words[1] = words[1].join('');

  return words.join(' ');
}

const OtherRegionRequestHandler = Handler('OtherRegionIntent', handlerInput => {
  const slot = handlerInput.requestEnvelope.request.intent.slots.other_region.value;

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
          title: capitalize(slot),
          image: data[slot].image,
          source: 'NASA',
          description: data[slot].description
        },
        'LEARN MORE'
      )
    )
    .addDirective({
      type: 'Alexa.Presentation.APL.ExecuteCommands',
      token: 'transcript_document',
      commands: [
        {
          type: 'SpeakItem',
          componentId: 'imageText',
          highlightMode: 'line',
          align: 'center'
        },
        {
          type: 'Scroll',
          componentId: 'scrollContainer',
          distance: -10000
        }
      ]
    })
    .getResponse();
});

module.exports = OtherRegionRequestHandler;
