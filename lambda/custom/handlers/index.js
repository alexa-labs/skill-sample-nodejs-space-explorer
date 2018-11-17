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

const LaunchRequestHandler = require('./launchRequestHandler');
const HelpRequestHandler = require('./helpRequestHandler');
const EventHandler = require('./eventHandler');
const CancelIntentHandler = require('./cancelIntentHandler');
const FallbackHandler = require('./fallbackHandler');

const ExploreZoneRequestHandler = require('./exploreZoneHandler');
const ExploreObjectRequestHandler = require('./exploreObjectHandler');
const ObjectAboutHandler = require('./objectAboutHandler');
const ObjectAtmosphereHandler = require('./objectAtmosphereHandler');
const ObjectSizeHandler = require('./objectSizeHandler');
const ObjectDistanceHandler = require('./objectDistanceHandler');
const ObjectSatellitesHandler = require('./objectSatellitesHandler');
const RandomImageRequestHandler = require('./randomImageHandler');
const ObjectRingHandler = require('./objectRingHandler');
const MoreInfoRequestHandler = require('./moreInfoHandler');
const SolarSystemRequestHandler = require('./solarSystemHandler');
const BackRequestHandler = require('./backHandler');
const OrdinalRequestHandler = require('./ordinalHandler');

const PlanetRequestHandler = require('./planetsHandler');
const PlutoRequestHandler = require('./plutoHandler');
const CometsRequestHandler = require('./cometsHandler');
const OtherRegionRequestHandler = require('./otherRegionHandler');
const TheMoonRequestHandler = require('./theMoonHandler');

module.exports = {
  LaunchRequestHandler,
  HelpRequestHandler,
  EventHandler,
  CancelIntentHandler,
  FallbackHandler,
  ExploreZoneRequestHandler,
  ExploreObjectRequestHandler,
  ObjectAboutHandler,
  ObjectAtmosphereHandler,
  ObjectSizeHandler,
  ObjectDistanceHandler,
  ObjectRingHandler,
  ObjectSatellitesHandler,
  RandomImageRequestHandler,
  MoreInfoRequestHandler,
  SolarSystemRequestHandler,
  BackRequestHandler,
  OrdinalRequestHandler,
  PlanetRequestHandler,
  PlutoRequestHandler,
  CometsRequestHandler,
  OtherRegionRequestHandler,
  TheMoonRequestHandler
};
