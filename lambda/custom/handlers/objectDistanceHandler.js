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
const DistanceResponse = require('../multimodal_responses/distanceResponse');

const ObjectDistanceHandler = Handler('ObjectDistance', handlerInput => {
  let fromSlot =
    handlerInput.requestEnvelope.request.intent.slots.celestial_object.value || 'earth';
  const objectSlot = handlerInput.requestEnvelope.request.intent.slots.celestial_object_two.value;
  const location = objectSlot || handlerInput.attributesManager.getSessionAttributes().location;
  const comparison = handlerInput.requestEnvelope.request.intent.slots.distance_comparison.value;
  let speech = '';

  if (fromSlot.toLowerCase() === location) {
    fromSlot = 'the sun';
  }

  if (!comparison && location && data[location.toLowerCase()]) {
    return DistanceResponse(handlerInput, location, fromSlot, null);
  }
  if (comparison && location && data[location.toLowerCase()]) {
    const basis = data.earth.distance;

    if (comparison === 'closer' || comparison === 'nearer') {
      const dist1 = Math.abs(basis - data[location.toLowerCase()]);
      const dist2 = Math.abs(basis - data[fromSlot.toLowerCase()]);
      const diff = dist1 - dist2;

      if (diff > 0) {
        speech = `${fromSlot}'s orbit is ${diff} miles closer than ${location}'s`;
      } else {
        speech = `${fromSlot}'s orbit is actually ${Math.abs(
          diff
        )} miles farther away than ${location}'s`;
      }
    } else if (
      comparison === 'father' ||
      comparison === 'further' ||
      comparison === 'father away' ||
      comparison === 'further away'
    ) {
      const dist1 = Math.abs(basis - data[location.toLowerCase()].distance);
      const dist2 = Math.abs(basis - data[fromSlot.toLowerCase()].distance);
      const diff = dist2 - dist1;

      // speech = comparison + ' ' + diff

      if (diff > 0) {
        speech = `${fromSlot}'s orbit is ${diff} miles farther away than ${location}'s`;
      } else {
        speech = `${fromSlot}'s orbit is actually ${Math.abs(
          diff
        )} miles closer than ${location}'s`;
      }
    }
  } else {
    speech = "I'm not sure I know that one.";
  }

  return DistanceResponse(handlerInput, location, fromSlot, speech);
});

module.exports = ObjectDistanceHandler;
