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

const SolarSystemResponse = require('../multimodal_responses/solarSystemResponse');
const ExploreResponse = require('../multimodal_responses/exploreResponse');
const ExploreZoneResponse = require('../multimodal_responses/exploreZoneResponse');
const DistanceResponse = require('../multimodal_responses/distanceResponse');
const SizeResponse = require('../multimodal_responses/sizeResponse');
const AtmosphereResponse = require('../multimodal_responses/atmosphereResponse');
const SatellitesResponse = require('../multimodal_responses/satellitesResponse');
const BackResponse = require('../multimodal_responses/backResponse');
const RandomImageResponse = require('../multimodal_responses/randomImageResponse');
const AboutResponse = require('../multimodal_responses/aboutResponse');

const MoonResponse = require('../multimodal_responses/moonResponse');

const EventHandler = {
  canHandle: handlerInput =>
    handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent',
  handle: handlerInput => {
    const args = handlerInput.requestEnvelope.request.arguments;
    const event = args[0];
    const data = args[1];

    switch (event) {
      case 'transcriptMediaEndedEvent':
        return handlerInput.responseBuilder
          .addDirective({
            type: 'Alexa.Presentation.APL.ExecuteCommands',
            token: 'transcript_document',
            commands: [
              {
                type: "ControlMedia",
                componentId: "myAudioPlayer",
                command: "rewind"
              },
              {
                type: "ControlMedia",
                componentId: "videoPlayer",
                command: "play"
              }  
            ]
          }).getResponse();
      case 'startEvent':
        return SolarSystemResponse(handlerInput);
      case 'exploreEvent':
        // return handlerInput.responseBuilder.speak(data).getResponse();
        return data === 'the moon'
          ? MoonResponse(handlerInput, false)
          : ExploreResponse(handlerInput, data, false);
      case 'exploreZoneEvent':
        return ExploreZoneResponse(handlerInput, data, false);
      case 'aboutEvent':
        return AboutResponse(handlerInput, data, false);
      case 'distanceEvent':
        return DistanceResponse(handlerInput, data, 'the sun', null, false);
      case 'sizeEvent':
        return SizeResponse(handlerInput, data, 'earth', null, false);
      case 'compositionEvent':
        return AtmosphereResponse(handlerInput, data, false);
      case 'satellitesEvent':
        return SatellitesResponse(handlerInput, data, false);
      case 'backEvent':
      case 'goBack':
        return BackResponse(handlerInput);
      case 'imageEvent':
        return RandomImageResponse(handlerInput, '');
      default:
        return SolarSystemResponse(handlerInput);
    }
  }
};

module.exports = EventHandler;
