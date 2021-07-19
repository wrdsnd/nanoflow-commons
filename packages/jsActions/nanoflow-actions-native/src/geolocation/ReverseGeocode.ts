// This file was generated by Mendix Studio Pro.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the code between BEGIN USER CODE and END USER CODE
// Other code you write will be lost the next time you deploy the project.

import Geodecoder from "react-native-geocoder";

type ReverseGeocodingProvider = "Google" | "Geocodio" | "LocationIQ" | "MapQuest";

/**
 * Reverse geocoding is the process of converting geographic coordinates (latitude and longitude) into a human-readable address.
 * @param {string} latitude - This field is required.
 * @param {string} longitude - This field is required.
 * @param {"NanoflowCommons.GeocodingProvider.Google"|"NanoflowCommons.GeocodingProvider.Geocodio"|"NanoflowCommons.GeocodingProvider.LocationIQ"|"NanoflowCommons.GeocodingProvider.MapQuest"} geocodingProvider - This field is required for use on web.
 * @param {string} providerApiKey - This field is required for use on web. Note that the keys are accessible by the end users and should be protected in other ways; for example restricted domain name.
 * @returns {Promise.<string>}
 */
export async function ReverseGeocode(
    latitude?: string,
    longitude?: string,
    geocodingProvider?: ReverseGeocodingProvider,
    providerApiKey?: string
): Promise<string> {
    // BEGIN USER CODE
    /**
     * Documentation:
     *  - Native: https://github.com/devfd/react-native-geocoder
     *  - Google: https://developers.google.com/maps/documentation/geocoding/intro#ReverseGeocoding
     *  - Geocodio: https://www.geocod.io/docs/#reverse-geocoding
     *  - LocationIQ: https://locationiq.com/docs-html/index.html#reverse-geocoding
     *  - MapQuest: https://developer.mapquest.com/documentation/open/geocoding-api/address/get/
     */

    if (!latitude) {
        return Promise.reject(new Error("Input parameter 'Latitude' is required"));
    }

    if (!longitude) {
        return Promise.reject(new Error("Input parameter 'Longitude' is required"));
    }

    if (navigator && navigator.product === "ReactNative") {
        const position = { lat: Number(latitude), lng: Number(longitude) };

        return Geodecoder.geocodePosition(position).then(results => {
            if (results.length === 0) {
                return Promise.reject(new Error("No results found"));
            }
            return results[0].formattedAddress;
        });
    }

    if (!geocodingProvider) {
        return Promise.reject(new Error("Input parameter 'Geocoding provider' is required for use on web"));
    }

    if (!providerApiKey) {
        return Promise.reject(new Error("Input parameter 'Provider api key' is required for use on web"));
    }

    latitude = encodeURIComponent(latitude);
    longitude = encodeURIComponent(longitude);
    providerApiKey = encodeURIComponent(providerApiKey);

    const url = getApiUrl(geocodingProvider, latitude, longitude, providerApiKey);

    return fetch(url)
        .then(response =>
            response.json().catch(() =>
                response.text().then(text => {
                    return Promise.reject(new Error(text));
                })
            )
        )
        .then(response => getAddress(geocodingProvider, response))
        .catch(error => Promise.reject(error));

    function getApiUrl(provider: ReverseGeocodingProvider, lat: string, long: string, key: string): string {
        switch (provider) {
            case "Google":
                return `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${key}`;
            case "Geocodio":
                return `https://api.geocod.io/v1.3/reverse?q=${lat},${long}&api_key=${key}`;
            case "LocationIQ":
                return `https://eu1.locationiq.com/v1/reverse.php?format=json&lat=${lat}&lon=${long}&key=${key}`;
            case "MapQuest":
                return `https://www.mapquestapi.com/geocoding/v1/reverse?location=${lat},${long}&key=${key}`;
        }
    }

    function getAddress(provider: ReverseGeocodingProvider, response: any): string {
        switch (provider) {
            case "Google":
                if (response.status !== "OK") {
                    throw new Error(response.error_message);
                }
                return response.results[0].formatted_address;
            case "Geocodio":
                if (response.error) {
                    throw new Error(response.error);
                }
                if (response.results.length === 0) {
                    throw new Error("No results found");
                }
                return response.results[0].formatted_address;
            case "LocationIQ":
                if (response.error) {
                    throw new Error(response.error);
                }
                return response.display_name;
            case "MapQuest":
                if (response.info.statuscode !== 0) {
                    throw new Error(response.info.messages.join(", "));
                }
                if (response.results.length === 0) {
                    throw new Error("No results found");
                }
                const location = response.results[0].locations[0];
                const city = location.adminArea5;
                const country = location.adminArea1;
                return `${location.street}, ${location.postalCode} ${city}, ${country}`;
        }
    }

    // END USER CODE
}
