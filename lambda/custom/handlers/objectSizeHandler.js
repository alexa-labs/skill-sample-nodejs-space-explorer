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

const Handler = require('../helpers/handler');
const data = require('../data/planets.json');
const SizeResponse = require('../multimodal_responses/sizeResponse');

const ObjectSizeHandler = Handler('ObjectSize', handlerInput => {
  const slot = handlerInput.requestEnvelope.request.intent.slots.celestial_object.value;
  const location = slot || handlerInput.attributesManager.getSessionAttributes().location;
  const comparison = handlerInput.requestEnvelope.request.intent.slots.size_comparison
    ? handlerInput.requestEnvelope.request.intent.slots.size_comparison.value
    : 'bigger';
  const comparator =
    handlerInput.requestEnvelope.request.intent.slots.celestial_object_two &&
    handlerInput.requestEnvelope.request.intent.slots.celestial_object_two.value
      ? handlerInput.requestEnvelope.request.intent.slots.celestial_object_two.value
      : 'earth';
  let speech = '';
  let diff;

  if (location && data[location.toLowerCase()]) {
    // speech = 'Comparator is ' + comparator + '. The comparison is ' + comparison;

    if (slot && comparator && (comparison === 'bigger' || comparison === 'larger')) {
      diff = data[location.toLowerCase()].diameter - data[comparator.toLowerCase()].diameter;

      if (diff > 0) {
        speech = `${location}'s diameter is ${diff} miles larger than ${comparator}'s`;
      } else {
        speech = `${location}'s diameter is ${Math.abs(diff)} miles smaller than ${comparator}'s`;
      }
    } else if (comparator && (comparison === 'bigger' || comparison === 'larger')) {
      diff = data[comparator.toLowerCase()].diameter - data[location.toLowerCase()].diameter;

      if (diff > 0) {
        speech = `${comparator}'s diameter is ${diff} miles larger than ${location}'s`;
      } else {
        speech = `${comparator}'s diameter is ${Math.abs(diff)} miles smaller than ${location}'s`;
      }
    } else if (slot && comparator && (comparison === 'smaller' || comparison === 'littler')) {
      diff = data[comparator.toLowerCase()].diameter - data[location.toLowerCase()].diameter;

      if (diff > 0) {
        speech = `${location}'s diameter is ${diff} miles smaller than ${comparator}'s`;
      } else {
        speech = `${location}'s diameter is ${Math.abs(diff)} miles larger than ${comparator}'s`;
      }
    } else if (comparator && (comparison === 'smaller' || comparison === 'littler')) {
      diff = data[location.toLowerCase()].diameter - data[comparator.toLowerCase()].diameter;

      if (diff > 0) {
        speech = `${comparator}'s diameter is ${diff} miles smaller than ${location}'s`;
      } else {
        speech = `${comparator}'s diameter is ${Math.abs(diff)} miles larger than ${location}'s`;
      }
    }
  } else {
    speech = "I'm not sure I know that one.";
    return handlerInput.responseBuilder.speak(speech).getResponse();
  }

  return SizeResponse(handlerInput, location, comparator, speech);
});

module.exports = ObjectSizeHandler;
