import { CurrentWeather, DayForecast, PlanningRecommendations, RecommendationAlert, ActivityAdvice } from '../types';

export function generateRecommendations(
  current: CurrentWeather,
  todayForecast?: DayForecast
): PlanningRecommendations {
  const tempC = current.temperature;
  const wind = current.windspeed;
  const code = current.weathercode;
  const precip = todayForecast ? todayForecast.precipitation : 0;
  const maxTemp = todayForecast ? todayForecast.maxTemp : tempC;

  const alerts: RecommendationAlert[] = [];
  const outfitItems: string[] = [];
  let outfitHeading = '';
  let outfitSuggestion = '';
  let summaryTitle = '';
  let summaryText = '';

  // 1. Rain / Precipitation check
  const isRainingOrWet =
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82) ||
    (code >= 95 && code <= 99) ||
    precip > 0.4;

  const isSnowing = (code >= 71 && code <= 77) || (code >= 85 && code <= 86);
  const isStormy = code >= 95 && code <= 99;

  // Alerts
  if (isStormy) {
    alerts.push({
      type: 'warning',
      title: 'Thunderstorm Warning',
      message: 'Active thunderstorm risk in your area. Seek secure indoor shelter and avoid open outdoor spaces.',
    });
  } else if (isRainingOrWet) {
    alerts.push({
      type: 'info',
      title: 'Precipitation Alert',
      message: `Rain or showers expected (${precip > 0 ? precip.toFixed(1) + ' mm' : 'intermittent'}). Pack an umbrella and wear water-resistant shoes.`,
    });
  }

  if (isSnowing) {
    alerts.push({
      type: 'warning',
      title: 'Snow & Ice Caution',
      message: 'Snowfall or frozen precipitation reported. Wear boots with deep tread and allow extra travel time.',
    });
  }

  if (tempC >= 30 || maxTemp >= 32) {
    alerts.push({
      type: 'caution',
      title: 'High Heat Advisory',
      message: 'Elevated daytime temperatures. Seek shade during peak midday hours, hydrate often, and wear broad-spectrum SPF.',
    });
  } else if (tempC <= 2) {
    alerts.push({
      type: 'caution',
      title: 'Frost / Near Freezing',
      message: 'Chilly temperatures with potential frost patches on pavements and shaded roadways.',
    });
  }

  if (wind >= 38) {
    alerts.push({
      type: 'warning',
      title: 'High Wind Velocity',
      message: `Gusty wind conditions (${Math.round(wind)} km/h). Secure lightweight patio furniture and anticipate crosswinds.`,
    });
  }

  // Outfit Selection Logic
  if (tempC >= 28) {
    outfitHeading = 'Hot & Sunny Attire';
    outfitSuggestion = 'Opt for loose-fitting, ultra-breathable fabrics in light neutral tones to reflect solar radiation.';
    outfitItems.push(
      'Airy cotton or linen tee / blouse',
      'Breathable shorts or linen trousers',
      'UV400 polarized sunglasses',
      'Wide-brim hat or sun visor',
      'Lightweight sandals or canvas sneakers'
    );
    summaryTitle = 'High Heat Conditions';
    summaryText = 'Ideal for relaxed shaded environments. Limit prolonged strenuous exertion under direct midday sun.';
  } else if (tempC >= 21) {
    outfitHeading = 'Comfortable Mild Attire';
    outfitSuggestion = 'Delightfully pleasant temperature. Classic everyday casual wear will keep you comfortable all day.';
    outfitItems.push(
      'Breathable cotton t-shirt or polo',
      'Chinos, denim jeans, or light joggers',
      'Light overshirt or cardigan for evening drop',
      'Comfortable walking shoes or sneakers'
    );
    summaryTitle = 'Pleasant & Mild Weather';
    summaryText = 'Wonderful atmospheric conditions for outdoor walks, dining al fresco, and everyday errands.';
  } else if (tempC >= 13) {
    outfitHeading = 'Brisk Transition Layers';
    outfitSuggestion = 'Noticeable chill in the air. Smart layering lets you easily adapt between indoor and outdoor temps.';
    outfitItems.push(
      'Long-sleeve tee, henley, or knit sweater',
      'Light jacket, denim coat, or utility windbreaker',
      'Tailored pants or full-length denim',
      'Closed leather sneakers or ankle boots'
    );
    summaryTitle = 'Crisp & Cool Outlook';
    summaryText = 'Great for brisk morning jogs and outdoor excursions with a dependable light jacket.';
  } else if (tempC >= 5) {
    outfitHeading = 'Chilly Weather Layers';
    outfitSuggestion = 'Cold outdoor conditions. Insulate your core with structured thermal layers and wind protection.';
    outfitItems.push(
      'Thermal undershirt + wool knit sweater',
      'Insulated parka, down jacket, or wool coat',
      'Warm wool socks and insulated boots',
      'Light fleece beanie and soft scarf'
    );
    summaryTitle = 'Chilly Winter/Autumn Conditions';
    summaryText = 'Stay comfortably bundled if venturing out. Keep commutes brisk and warm beverages handy.';
  } else {
    outfitHeading = 'Sub-Zero / Heavy Cold Attire';
    outfitSuggestion = 'Intense cold or freezing air. Full winter defense gear is essential to minimize windchill exposure.';
    outfitItems.push(
      'Heavy-fill down parka or expedition coat',
      'Thermal base layer top and bottoms',
      'Insulated weatherproof boots with grip',
      'Thermal gloves or mittens + lined beanie',
      'Wool neck gaiter or fleece scarf'
    );
    summaryTitle = 'Freezing Cold Warning';
    summaryText = 'Keep skin covered to defend against biting cold wind chill. Keep outdoor stops short.';
  }

  if (isRainingOrWet) {
    outfitItems.unshift('Waterproof trench / rain shell', 'Compact windproof umbrella');
  }

  // Activity recommendations
  const activities: ActivityAdvice[] = [];

  // Running / Jogging
  if (isStormy || isSnowing || tempC > 34) {
    activities.push({
      name: 'Running & Cardio',
      status: 'Not Recommended',
      reason: isStormy
        ? 'Dangerous lightning and stormy gusts.'
        : isSnowing
        ? 'Slippery footing and poor visibility.'
        : 'High heat exhaustion hazard.',
    });
  } else if (isRainingOrWet) {
    activities.push({
      name: 'Running & Cardio',
      status: 'Caution',
      reason: 'Slick asphalt surfaces and wet clothing chills.',
    });
  } else if (tempC >= 10 && tempC <= 23 && wind < 30) {
    activities.push({
      name: 'Running & Cardio',
      status: 'Ideal',
      reason: 'Optimal oxygen uptake and thermal balance conditions.',
    });
  } else {
    activities.push({
      name: 'Running & Cardio',
      status: 'Good',
      reason: 'Comfortable with appropriate hydration and layers.',
    });
  }

  // Cycling / Commuting
  if (isStormy || wind > 40 || isSnowing) {
    activities.push({
      name: 'Cycling & Scooting',
      status: 'Not Recommended',
      reason: 'High crosswinds and slick roadway surfaces.',
    });
  } else if (isRainingOrWet || wind > 25) {
    activities.push({
      name: 'Cycling & Scooting',
      status: 'Caution',
      reason: 'Reduced braking traction and spray from vehicles.',
    });
  } else {
    activities.push({
      name: 'Cycling & Scooting',
      status: 'Ideal',
      reason: 'Clear roadways and comfortable ambient resistance.',
    });
  }

  // Outdoor Dining / Parks
  if (isStormy || isRainingOrWet || tempC < 8) {
    activities.push({
      name: 'Al Fresco Dining & Parks',
      status: 'Not Recommended',
      reason: 'Wet seating and adverse chill; indoor dining preferred.',
    });
  } else if (tempC >= 18 && tempC <= 27 && wind < 25) {
    activities.push({
      name: 'Al Fresco Dining & Parks',
      status: 'Ideal',
      reason: 'Delightful ambient temperature and gentle breeze.',
    });
  } else {
    activities.push({
      name: 'Al Fresco Dining & Parks',
      status: 'Good',
      reason: 'Pleasant with shaded patio cover or space heaters.',
    });
  }

  // Sightseeing & Walking
  if (isStormy) {
    activities.push({
      name: 'Sightseeing & Walking',
      status: 'Not Recommended',
      reason: 'Severe weather alert in effect. Enjoy museums or indoor galleries.',
    });
  } else if (isRainingOrWet) {
    activities.push({
      name: 'Sightseeing & Walking',
      status: 'Caution',
      reason: 'Feasible with a sturdy umbrella and hooded jacket.',
    });
  } else {
    activities.push({
      name: 'Sightseeing & Walking',
      status: 'Ideal',
      reason: 'Great visibility and comfortable walking environment.',
    });
  }

  return {
    summaryTitle,
    summaryText,
    outfitAdvice: {
      heading: outfitHeading,
      suggestion: outfitSuggestion,
      items: outfitItems,
    },
    alerts,
    activities,
  };
}
