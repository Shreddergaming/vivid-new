'use client'

import { useState, useCallback, useEffect } from 'react'
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { MapPin, UtensilsCrossed, TreePine, Bus, Building2 } from 'lucide-react'

// Define libraries as a static constant to prevent reloading
const libraries: ["places", "geometry"] = ["places", "geometry"]

// Move map options outside component
const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false
}

const mapContainerStyle = {
    width: '100%',
    height: '400px'
}

interface NearbyPlace {
    type: string
    name: string
    distance: string
    walkingTime: string
    coordinates: {
        lat: number
        lng: number
    }
    icon?: string
}

export function LocationSection({
    lat,
    lng,
    address,
    nearbyPlaces: initialPlaces = []
}: {
    lat: number
    lng: number
    address: string
    nearbyPlaces?: NearbyPlace[]
}) {
    const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null)
    const [map, setMap] = useState<google.maps.Map | null>(null)
    const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>(initialPlaces)

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: libraries,
        version: "weekly"
    })

    const fetchPlaces = useCallback(async () => {
        if (!map || !isLoaded) return;

        try {
            const service = new google.maps.places.PlacesService(map)
            const center = { lat: Number(lat), lng: Number(lng) }

            if (isNaN(center.lat) || isNaN(center.lng)) {
                console.error('Invalid coordinates:', { lat, lng })
                return
            }

            const searchTypes = [
                { type: 'restaurant', name: 'Restaurants' },
                { type: 'park', name: 'Parks' },
                { type: 'transit_station', name: 'Transit Stations' },
                { type: 'shopping_mall', name: 'Shopping Centers' }
            ]

            const places: NearbyPlace[] = []

            for (const { type, name } of searchTypes) {
                const request = {
                    location: center,
                    radius: 32000,
                    type: type
                }

                try {
                    const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
                        service.nearbySearch(request, (results, status) => {
                            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                                resolve(results)
                            } else {
                                reject(new Error(`Places search failed: ${status}`))
                            }
                        })
                    })

                    if (results?.[0]?.geometry?.location) {
                        const place = results[0]
                        const placeLocation = {
                            lat: place.geometry?.location?.lat() ?? 0,
                            lng: place.geometry?.location?.lng() ?? 0
                        }

                        const distance = google.maps.geometry.spherical.computeDistanceBetween(
                            new google.maps.LatLng(center),
                            new google.maps.LatLng(placeLocation)
                        )

                        places.push({
                            type,
                            name: place.name || name,
                            distance: `${(distance / 1609.34).toFixed(1)} mi`,
                            walkingTime: `${Math.round((distance / 1609.34) * 20)} min`,
                            coordinates: placeLocation
                        })
                    }
                } catch (error) {
                    console.error(`Error searching for ${type}:`, error)
                }
            }

            setNearbyPlaces(places)
        } catch (error) {
            console.error('Error fetching places:', error)
        }
    }, [map, isLoaded, lat, lng])

    useEffect(() => {
        if (isLoaded && map) {
            fetchPlaces()
        }
    }, [isLoaded, map, fetchPlaces])

    const handlePlaceClick = useCallback((place: NearbyPlace) => {
        setSelectedPlace(place)
        map?.panTo(place.coordinates)
        map?.setZoom(16)
    }, [map])

    const getMarkerIcon = (type: string) => {
        switch (type) {
            case 'restaurant': return '/icons/restaurant.svg'
            case 'park': return '/icons/park.svg'
            case 'transit': return '/icons/transit.svg'
            case 'shopping': return '/icons/shopping.svg'
            default: return '/icons/default.svg'
        }
    }

    if (!isLoaded) {
        return (
            <div className="py-8 border-b">
                <div className="h-[400px] rounded-xl bg-gray-100 animate-pulse flex items-center justify-center">
                    <span className="text-gray-400">Loading map...</span>
                </div>
            </div>
        )
    }

    if (loadError) {
        return (
            <div className="py-8 border-b">
                <div className="h-[400px] rounded-xl bg-red-50 flex items-center justify-center">
                    <span className="text-red-500">Error loading map</span>
                </div>
            </div>
        )
    }

    return (
        <div className="py-8 border-b">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Where you'll be</h2>
                <button
                    className="flex items-center gap-2 text-sm font-medium underline"
                    onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
                        window.open(url, '_blank')
                    }}
                >
                    <MapPin className="h-4 w-4" />
                    Get Directions
                </button>
            </div>

            <div className="mb-8 rounded-xl overflow-hidden">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={15}
                    center={{
                        lat: typeof lat === 'number' ? lat : parseFloat(String(lat)),
                        lng: typeof lng === 'number' ? lng : parseFloat(String(lng))
                    }}
                    onLoad={setMap}
                    options={mapOptions}
                >
                    <Marker
                        position={{ lat, lng }}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: "#FF385C",
                            fillOpacity: 1,
                            strokeColor: "#FFFFFF",
                            strokeWeight: 2
                        }}
                    />
                    {nearbyPlaces.map((place, index) => (
                        <Marker
                            key={index}
                            position={place.coordinates}
                            onClick={() => setSelectedPlace(place)}
                        />
                    ))}

                    {selectedPlace && (
                        <InfoWindow
                            position={selectedPlace.coordinates}
                            onCloseClick={() => setSelectedPlace(null)}
                        >
                            <div>
                                <p className="font-medium">{selectedPlace.name}</p>
                                <p className="text-sm text-gray-600">
                                    {selectedPlace.distance} · {selectedPlace.walkingTime} walk
                                </p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </div>

            <div className="mt-8">
                <h3 className="font-semibold mb-4">What's nearby</h3>
                <div className="grid grid-cols-2 gap-x-24 gap-y-6">
                    {nearbyPlaces.map((place, index) => (
                        <div
                            key={index}
                            className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            onClick={() => handlePlaceClick(place)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 flex items-center justify-center">
                                    {place.type === 'restaurant' ? <UtensilsCrossed className="h-5 w-5 text-gray-600" /> :
                                        place.type === 'park' ? <TreePine className="h-5 w-5 text-gray-600" /> :
                                            place.type === 'transit_station' ? <Bus className="h-5 w-5 text-gray-600" /> :
                                                <Building2 className="h-5 w-5 text-gray-600" />}
                                </div>
                                <div>
                                    <p className="font-medium">{place.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {place.distance} · {place.walkingTime} walk
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 