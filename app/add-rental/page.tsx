'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Building2, Hotel, Castle, TreePine, Warehouse, Palmtree, Wifi, Tv, UtensilsCrossed, Waves, Car, Snowflake, Laptop, WavesIcon, Flame, Home, PawPrint, Ship, Tent, X, Upload, ChevronLeft, ChevronRight } from 'lucide-react'
import { GoogleMap, LoadScript, Marker, useLoadScript, Autocomplete } from '@react-google-maps/api'
import { useSession } from 'next-auth/react'
import { toast } from '@/components/ui/use-toast'

interface FormData {
    propertyType: string;
    entirePlace: boolean;
    address: string;
    unitNumber?: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: { lat: number; lng: number };
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    amenities: string[];
    photos: string[];
    title: string;
    description: string;
    basePrice: number;
    weekendPrice: number;
    weekendPremium: number;
    discounts: {
        newListing: boolean;
        lastMinute: boolean;
        weekly: boolean;
        monthly: boolean;
    };
    safety: {
        securityCamera: boolean;
        noiseMonitor: boolean;
        weapons: boolean;
    };
    petsAllowed: boolean;
}

const libraries = ['places'] as const;

export default function AddRentalPage() {
    const { data: session } = useSession()
    const [step, setStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const totalSteps = 12
    const progress = ((step) / totalSteps) * 100

    const [formData, setFormData] = useState<FormData>({
        propertyType: '',
        entirePlace: true,
        address: '',
        city: '',
        state: '',
        zipCode: '',
        coordinates: { lat: 0, lng: 0 },
        guests: 4,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        amenities: [],
        photos: [],
        title: '',
        description: '',
        basePrice: 100,
        weekendPrice: 107,
        weekendPremium: 7,
        discounts: {
            newListing: true,
            lastMinute: false,
            weekly: false,
            monthly: false
        },
        safety: {
            securityCamera: false,
            noiseMonitor: false,
            weapons: false
        },
        petsAllowed: false
    })

    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const propertyTypes = [
        { id: 'beachfront', label: 'Beachfront', Icon: Waves },
        { id: 'apartments', label: 'Apartments', Icon: Building2 },
        { id: 'cabins', label: 'Cabins', Icon: Home },
        { id: 'houseboats', label: 'Houseboats', Icon: Ship },
        { id: 'camping', label: 'Camping', Icon: Tent },
        { id: 'lake', label: 'Lake', Icon: Waves },
        { id: 'ski-in/out', label: 'Ski-in/out', Icon: Snowflake },
        { id: 'tropical', label: 'Tropical', Icon: Palmtree },
        { id: 'mansions', label: 'Mansions', Icon: Castle }
    ]

    const amenities = [
        { id: 'wifi', label: 'Wifi', Icon: Wifi },
        { id: 'tv', label: 'TV', Icon: Tv },
        { id: 'kitchen', label: 'Kitchen', Icon: UtensilsCrossed },
        { id: 'washer', label: 'Washer', Icon: Waves },
        { id: 'parking', label: 'Free parking', Icon: Car },
        { id: 'ac', label: 'Air conditioning', Icon: Snowflake },
        { id: 'workspace', label: 'Workspace', Icon: Laptop },
        { id: 'pool', label: 'Pool', Icon: Waves },
        { id: 'hottub', label: 'Hot tub', Icon: Flame },
        { id: 'patio', label: 'Patio', Icon: Home }
    ]

    const fileInputRef = useRef<HTMLInputElement>(null)

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: ['places'] as const,
        version: "weekly"
    })

    console.log('Maps Loading Status:', {
        isLoaded,
        hasError: !!loadError,
        errorMessage: loadError?.message,
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.slice(0, 5) + '...',
    });

    console.log('Map Load Error:', loadError)
    console.log('API Key:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)

    useEffect(() => {
        console.log('Detailed Google Maps Status:', {
            isLoaded,
            hasError: !!loadError,
            errorMessage: loadError?.message,
            apiKeyPresent: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
            apiKeyFirstChars: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.substring(0, 10),
        });
    }, [isLoaded, loadError]);

    const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete | null>(null);

    const router = useRouter()

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true)
            if (!session?.user) {
                toast({
                    title: "Please sign in",
                    description: "You need to be signed in to create a listing",
                    variant: "destructive"
                })
                return
            }

            // Log the form data before submission
            console.log('Submitting form data:', formData)

            // Upload photos to S3
            const uploadedPhotos = await Promise.all(
                formData.photos.map(async (photoUrl) => {
                    try {
                        const response = await fetch(photoUrl)
                        const blob = await response.blob()
                        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' })

                        const formData = new FormData()
                        formData.append('file', file)

                        const uploadRes = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData
                        })

                        if (!uploadRes.ok) {
                            const errorData = await uploadRes.json()
                            throw new Error(`Failed to upload photo: ${errorData.error}`)
                        }

                        const { url } = await uploadRes.json()
                        return url
                    } catch (error) {
                        console.error('Error uploading photo:', error)
                        throw error
                    }
                })
            )

            // Create rental with uploaded photos
            const response = await fetch('/api/rentals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    photos: uploadedPhotos
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to create listing')
            }

            const result = await response.json()
            router.push('/dashboard')
        } catch (error) {
            console.error('Error creating listing:', error)
            toast({
                title: "Error",
                description: error.message || "Failed to create listing. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-8 pt-12">
                        <h1 className="text-4xl font-semibold">It's easy to get started on Vivid</h1>

                        <div className="w-full max-w-2xl space-y-12 pt-8">
                            <div className="flex items-start gap-6">
                                <div className="text-2xl">1</div>
                                <div className="text-left">
                                    <h3 className="text-xl font-medium">Tell us about your place</h3>
                                    <p className="text-gray-600">Share some basic info, like where it is and how many guests can stay.</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <Image
                                        src="/illustrations/step1.png"
                                        alt="Step 1"
                                        width={150}
                                        height={150}
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="text-2xl">2</div>
                                <div className="text-left">
                                    <h3 className="text-xl font-medium">Make it stand out</h3>
                                    <p className="text-gray-600">Add 5 or more photos plus a title and description—we'll help you out.</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <Image
                                        src="/illustrations/step2.png"
                                        alt="Step 2"
                                        width={150}
                                        height={150}
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="text-2xl">3</div>
                                <div className="text-left">
                                    <h3 className="text-xl font-medium">Finish up and publish</h3>
                                    <p className="text-gray-600">Choose if you'd like to start with an experienced guest, set a starting price, and publish your listing.</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <Image
                                        src="/illustrations/step3.png"
                                        alt="Step 3"
                                        width={150}
                                        height={150}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 1:
                return (
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div>
                            <div className="text-sm text-gray-600 mb-2">Step 1</div>
                            <h1 className="text-3xl font-semibold mb-2">Tell us about your place</h1>
                            <p className="text-gray-600">In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-medium mb-4">Which of these best describes your place?</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {propertyTypes.map((type) => {
                                        const Icon = type.Icon
                                        return (
                                            <button
                                                key={type.id}
                                                className={`p-6 border rounded-xl text-left hover:border-black transition-all ${formData.propertyType === type.id
                                                    ? 'border-black border-2'
                                                    : 'border-gray-200'
                                                    }`}
                                                onClick={() => setFormData({ ...formData, propertyType: type.id })}
                                            >
                                                <Icon className="h-8 w-8 mb-2" />
                                                <div className="font-medium">{type.label}</div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div>
                            <h1 className="text-3xl font-semibold mb-2">What type of place will guests have?</h1>
                            <p className="text-gray-600">Choose the option that best describes your place.</p>
                        </div>

                        <RadioGroup
                            value={formData.entirePlace ? "entire" : "room"}
                            onValueChange={(value) => setFormData({ ...formData, entirePlace: value === "entire" })}
                            className="space-y-4"
                        >
                            <div className={`p-6 border rounded-xl cursor-pointer hover:border-black transition-all ${formData.entirePlace ? 'border-black border-2' : 'border-gray-200'
                                }`}>
                                <RadioGroupItem value="entire" id="entire" className="hidden" />
                                <Label htmlFor="entire" className="cursor-pointer">
                                    <div className="font-medium text-lg mb-1">An entire place</div>
                                    <div className="text-gray-500">Guests have the whole place to themselves.</div>
                                </Label>
                            </div>

                            <div className={`p-6 border rounded-xl cursor-pointer hover:border-black transition-all ${!formData.entirePlace ? 'border-black border-2' : 'border-gray-200'
                                }`}>
                                <RadioGroupItem value="room" id="room" className="hidden" />
                                <Label htmlFor="room" className="cursor-pointer">
                                    <div className="font-medium text-lg mb-1">A room</div>
                                    <div className="text-gray-500">Guests have their own room in a home, plus access to shared spaces.</div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                )

            case 3:
                return (
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div>
                            <h1 className="text-3xl font-semibold mb-2">Share some basics about your place</h1>
                            <p className="text-gray-600">You'll add more details later, like bed types.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-lg font-medium">Guests</label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={formData.guests}
                                    onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-lg font-medium">Bedrooms</label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={formData.bedrooms}
                                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-lg font-medium">Bathrooms</label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={formData.bathrooms}
                                    onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="grid grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="text-sm text-gray-600 mb-2">Step 2</div>
                                <h1 className="text-3xl font-semibold mb-2">Make your place stand out</h1>
                                <p className="text-gray-600">In this step, you'll add some of the amenities your place offers, plus 5 or more photos. Then, you'll create a title and description.</p>
                            </div>
                            <div className="flex justify-center">
                                <Image
                                    src="/illustrations/make-stand-out.png"
                                    alt="Make your place stand out"
                                    width={300}
                                    height={300}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                )

            case 5:
                return (
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div>
                            <div className="text-sm text-gray-600 mb-2">Step 2</div>
                            <h1 className="text-3xl font-semibold mb-2">Where's your place located?</h1>
                            <p className="text-gray-600">Your address is only shared with guests after they've made a reservation.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-lg font-medium">Street address</label>
                                    <Autocomplete
                                        onLoad={(autocomplete) => setSearchBox(autocomplete)}
                                        onPlaceChanged={() => {
                                            if (searchBox) {
                                                const place = searchBox.getPlace();
                                                if (place.geometry?.location) {
                                                    const lat = place.geometry.location.lat();
                                                    const lng = place.geometry.location.lng();

                                                    // Extract address components
                                                    const addressComponents = place.address_components || [];
                                                    const city = addressComponents.find(c => c.types.includes('locality'))?.long_name || '';
                                                    const state = addressComponents.find(c => c.types.includes('administrative_area_level_1'))?.short_name || '';
                                                    const zipCode = addressComponents.find(c => c.types.includes('postal_code'))?.long_name || '';
                                                    const streetNumber = addressComponents.find(c => c.types.includes('street_number'))?.long_name || '';
                                                    const route = addressComponents.find(c => c.types.includes('route'))?.long_name || '';

                                                    setFormData(prev => ({
                                                        ...prev,
                                                        address: `${streetNumber} ${route}`,
                                                        city,
                                                        state,
                                                        zipCode,
                                                        coordinates: { lat, lng }
                                                    }));
                                                }
                                            }
                                        }}
                                    >
                                        <Input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                            placeholder="Enter your address"
                                            className="mt-2"
                                            required
                                        />
                                    </Autocomplete>
                                </div>

                                <div>
                                    <label className="text-lg font-medium">Apartment, suite, etc. (optional)</label>
                                    <Input
                                        type="text"
                                        value={formData.unitNumber}
                                        onChange={(e) => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))}
                                        placeholder="Optional"
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <label className="text-lg font-medium">City</label>
                                    <Input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                        placeholder="Required"
                                        className="mt-2"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-lg font-medium">State</label>
                                    <Input
                                        type="text"
                                        value={formData.state}
                                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                                        placeholder="Required"
                                        className="mt-2"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-lg font-medium">ZIP code</label>
                                    <Input
                                        type="text"
                                        value={formData.zipCode}
                                        onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                                        placeholder="Required"
                                        className="mt-2"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="h-full min-h-[400px] rounded-xl overflow-hidden border">
                                {!isLoaded ? (
                                    <div className="h-full flex items-center justify-center bg-gray-50">
                                        <div>Loading Maps...</div>
                                    </div>
                                ) : loadError ? (
                                    <div className="h-full flex items-center justify-center bg-gray-50 flex-col gap-2 p-4">
                                        <p className="text-red-500 font-medium">Error loading Google Maps</p>
                                        <p className="text-sm text-gray-600">{loadError.message}</p>
                                        <p className="text-xs text-gray-400 mt-2">Debug Info:</p>
                                        <pre className="text-xs bg-gray-100 p-2 rounded">
                                            {JSON.stringify({
                                                apiKeyPresent: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
                                                apiKeyStart: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.substring(0, 10),
                                                error: loadError.message
                                            }, null, 2)}
                                        </pre>
                                    </div>
                                ) : (
                                    <GoogleMap
                                        mapContainerStyle={{ width: '100%', height: '100%' }}
                                        center={formData.coordinates.lat !== 0 ? formData.coordinates : { lat: 40.7128, lng: -74.0060 }}
                                        zoom={15}
                                    >
                                        {formData.coordinates.lat !== 0 && (
                                            <Marker position={formData.coordinates} />
                                        )}
                                    </GoogleMap>
                                )}
                            </div>
                        </div>
                    </div>
                )

            case 6:
                return (
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div>
                            <div className="text-sm text-gray-600 mb-2">Step 2</div>
                            <h1 className="text-3xl font-semibold mb-2">Is the pin in the right spot?</h1>
                            <p className="text-gray-600">Your address is only shared with guests after they've made a reservation.</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="font-medium">{formData.address}</p>
                            <p className="text-gray-600">{formData.city}, {formData.state} {formData.zipCode}</p>
                        </div>

                        <div className="h-[500px] rounded-xl overflow-hidden border">
                            {!isLoaded ? (
                                <div className="h-full flex items-center justify-center bg-gray-50">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                                </div>
                            ) : (
                                <GoogleMap
                                    mapContainerStyle={{ width: '100%', height: '100%' }}
                                    center={formData.coordinates}
                                    zoom={16}
                                >
                                    <Marker
                                        position={formData.coordinates}
                                        draggable={true}
                                        onDragEnd={(e) => {
                                            if (e.latLng) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    coordinates: {
                                                        lat: e.latLng?.lat() || prev.coordinates.lat,
                                                        lng: e.latLng?.lng() || prev.coordinates.lng
                                                    }
                                                }));
                                            }
                                        }}
                                    />
                                </GoogleMap>
                            )}
                        </div>
                    </div>
                )

            case 7:
                return (
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div>
                            <div className="text-sm text-gray-600 mb-2">Step 2</div>
                            <h1 className="text-3xl font-semibold mb-2">Tell guests what your place has to offer</h1>
                            <p className="text-gray-600">You can add more amenities after you publish your listing.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-medium mb-4">What about these guest favorites?</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {amenities.map((amenity) => {
                                        const Icon = amenity.Icon
                                        return (
                                            <div
                                                key={amenity.id}
                                                className={`p-6 border rounded-xl cursor-pointer hover:border-black transition-all ${formData.amenities.includes(amenity.id)
                                                    ? 'border-black border-2'
                                                    : 'border-gray-200'
                                                    }`}
                                                onClick={() => {
                                                    const newAmenities = formData.amenities.includes(amenity.id)
                                                        ? formData.amenities.filter(id => id !== amenity.id)
                                                        : [...formData.amenities, amenity.id]
                                                    setFormData({ ...formData, amenities: newAmenities })
                                                }}
                                            >
                                                <Icon className="h-8 w-8 mb-2" />
                                                <div className="font-medium">{amenity.label}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 8:
                const validatePhoto = (file: File) => {
                    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
                    const maxSize = 5 * 1024 * 1024; // 5MB

                    if (!validTypes.includes(file.type)) {
                        return 'Invalid file type. Please upload JPG, PNG, or WebP images.';
                    }

                    if (file.size > maxSize) {
                        return 'File too large. Maximum size is 5MB.';
                    }

                    return null;
                };

                const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
                    const files = Array.from(e.target.files || []);
                    const validFiles: File[] = [];
                    const errors: string[] = [];

                    for (const file of files) {
                        const error = validatePhoto(file);
                        if (error) {
                            errors.push(`${file.name}: ${error}`);
                        } else {
                            validFiles.push(file);
                        }
                    }

                    if (errors.length > 0) {
                        alert(errors.join('\n'));
                    }

                    if (validFiles.length > 0) {
                        const newPhotos = validFiles.map(file => ({
                            url: URL.createObjectURL(file),
                            file
                        }));

                        setFormData(prev => ({
                            ...prev,
                            photos: [...prev.photos, ...newPhotos.map(p => p.url)]
                        }));
                    }
                };

                return (
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div>
                            <div className="text-sm text-gray-600 mb-2">Step 2</div>
                            <h1 className="text-3xl font-semibold mb-2">Add some photos of your place</h1>
                            <p className="text-gray-600">You'll need 5 photos to get started. You can add more or make changes later.</p>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        <div className="space-y-4">
                            {formData.photos.length > 0 && (
                                <div className="grid grid-cols-2 gap-4">
                                    {formData.photos.map((photo, index) => (
                                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden border">
                                            <Image
                                                src={photo}
                                                alt={`Photo ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                onError={(e) => {
                                                    console.error('Image load error:', e)
                                                    const target = e.target as HTMLImageElement
                                                    target.src = '/placeholder-image.png'
                                                }}
                                            />
                                            <button
                                                onClick={() => {
                                                    const newPhotos = formData.photos.filter((_, i) => i !== index);
                                                    setFormData(prev => ({ ...prev, photos: newPhotos }));
                                                }}
                                                className="absolute top-2 right-2 p-1.5 bg-white rounded-full hover:bg-gray-100"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all hover:border-gray-400 ${formData.photos.length === 0 ? 'mt-0' : 'mt-4'
                                    }`}
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 rounded-full bg-gray-50">
                                        <Upload className="h-8 w-8 text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Drag your photos here</h3>
                                        <p className="text-gray-600">Choose at least 5 photos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 9:
                return (
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div>
                            <div className="text-sm text-gray-600 mb-2">Step 2</div>
                            <h1 className="text-3xl font-semibold mb-2">Now, let's give your place a title</h1>
                            <p className="text-gray-600">Short titles work best. Have fun with it—you can always change it later.</p>
                        </div>

                        <div className="space-y-4">
                            <Input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter title"
                                className="text-xl p-4"
                            />
                            <p className="text-sm text-gray-500">{formData.title.length}/50</p>
                        </div>
                    </div>
                )

            case 10:
                return (
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div>
                            <div className="text-sm text-gray-600 mb-2">Step 2</div>
                            <h1 className="text-3xl font-semibold mb-2">Create your description</h1>
                            <p className="text-gray-600">Share what makes your place special.</p>
                        </div>

                        <div>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Write a description for your place..."
                                className="min-h-[200px] text-lg p-4"
                            />
                            <p className="text-sm text-gray-500 mt-2">{formData.description.length} characters</p>
                        </div>
                    </div>
                )

            case 11:
                return (
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div>
                            <div className="text-sm text-gray-600 mb-2">Step 3</div>
                            <h1 className="text-3xl font-semibold mb-2">Now, set your price</h1>
                            <p className="text-gray-600">You can change it anytime.</p>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                            <span className="text-6xl font-semibold">$</span>
                            <Input
                                type="number"
                                value={formData.basePrice}
                                onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) || 0 })}
                                className="text-6xl w-40 h-20 text-center border-none focus:ring-0 font-semibold p-0"
                                style={{ fontSize: 'inherit' }}
                            />
                        </div>

                        <p className="text-center text-gray-600">
                            Places like yours in your area usually range from $75 to $200
                        </p>
                    </div>
                )

            case 12:
                return (
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div>
                            <div className="text-sm text-gray-600 mb-2">Final Step</div>
                            <h1 className="text-3xl font-semibold mb-2">Review your listing</h1>
                            <p className="text-gray-600">Here's what we'll show to guests. Make sure everything looks good.</p>
                        </div>

                        <div className="space-y-8">
                            {/* Preview Images */}
                            {formData.photos.length > 0 && (
                                <div className="aspect-video relative rounded-xl overflow-hidden">
                                    <Image
                                        src={formData.photos[currentImageIndex]}
                                        alt="Property"
                                        fill
                                        className="object-cover"
                                    />
                                    {formData.photos.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setCurrentImageIndex(prev => prev === 0 ? formData.photos.length - 1 : prev - 1)}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
                                            >
                                                <ChevronLeft className="h-6 w-6" />
                                            </button>
                                            <button
                                                onClick={() => setCurrentImageIndex(prev => prev === formData.photos.length - 1 ? 0 : prev + 1)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
                                            >
                                                <ChevronRight className="h-6 w-6" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold">{formData.title}</h2>
                                <p className="text-gray-600">{formData.description}</p>
                            </div>

                            {/* Property Type & Details */}
                            <div className="border-t pt-4 space-y-4">
                                <div>
                                    <p className="font-medium">Property Type</p>
                                    <p className="text-gray-600">
                                        {propertyTypes.find(type => type.id === formData.propertyType)?.label} -
                                        {formData.entirePlace ? ' Entire place' : ' Private room'}
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium">Details</p>
                                    <p className="text-gray-600">
                                        {formData.guests} guests · {formData.bedrooms} bedrooms · {formData.bathrooms} bathrooms
                                    </p>
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="border-t pt-4">
                                <p className="font-medium mb-3">Amenities</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {formData.amenities.map(amenityId => {
                                        const amenity = amenities.find(a => a.id === amenityId);
                                        if (!amenity) return null;
                                        const Icon = amenity.Icon;
                                        return (
                                            <div key={amenityId} className="flex items-center gap-2">
                                                <Icon className="h-5 w-5 text-gray-600" />
                                                <span className="text-gray-600">{amenity.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Location */}
                            <div className="border-t pt-4 space-y-4">
                                <div>
                                    <p className="font-medium">Location</p>
                                    <p className="text-gray-600">{formData.address}</p>
                                    <p className="text-gray-600">{formData.city}, {formData.state} {formData.zipCode}</p>
                                </div>

                                <div className="h-[300px] rounded-xl overflow-hidden border">
                                    {isLoaded && (
                                        <GoogleMap
                                            mapContainerStyle={{ width: '100%', height: '100%' }}
                                            center={formData.coordinates}
                                            zoom={15}
                                        >
                                            <Marker position={formData.coordinates} />
                                        </GoogleMap>
                                    )}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="border-t pt-4">
                                <p className="font-medium">Price</p>
                                <p className="text-gray-600">${formData.basePrice} per night</p>
                            </div>
                        </div>
                    </div>
                )
        }
    }

    const canProceedToNextStep = () => {
        switch (step) {
            case 0:
                return true // Can always proceed from landing page
            case 1:
                return formData.propertyType !== ''
            case 2:
                return true // Place type always has a value
            case 3:
                return formData.guests > 0 && formData.bedrooms > 0 && formData.bathrooms > 0
            case 5:
                return formData.address && formData.city && formData.state && formData.zipCode
            case 6:
                return true // Pin confirmation is optional
            case 7:
                return formData.amenities.length > 0
            case 8:
                return formData.photos.length >= 5
            case 9:
                return formData.title.length >= 10 // Minimum title length
            case 10:
                return formData.description.length >= 50 // Minimum description length
            case 11:
                return formData.basePrice > 0
            case 12:
                return true
            default:
                return true
        }
    }

    const getErrorMessage = () => {
        switch (step) {
            case 1:
                return 'Please select a property type'
            case 3:
                return 'Please fill in all guest information'
            case 5:
                return 'Please complete all address fields'
            case 7:
                return 'Please select at least one amenity'
            case 8:
                return `Please add ${5 - formData.photos.length} more photos`
            case 9:
                return 'Title must be at least 10 characters'
            case 10:
                return 'Description must be at least 50 characters'
            case 11:
                return 'Please set a base price'
            default:
                return ''
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Header */}
            <header className="border-b fixed top-0 w-full bg-white z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="text-xl">
                        <Image
                            src="/vivid-logo.png"
                            alt="Vivid"
                            width={100}
                            height={32}
                            priority
                        />
                    </div>
                    <div className="flex gap-4">
                        <Button variant="ghost">Questions?</Button>
                        <Button variant="ghost">Save & exit</Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow pt-20 pb-32">
                <div className="container mx-auto px-4">
                    {renderStep()}
                </div>
            </main>

            {/* Footer with Progress Bar */}
            <footer className="border-t fixed bottom-0 w-full bg-white">
                {!canProceedToNextStep() && (
                    <div className="container mx-auto px-4 py-2 text-center">
                        <p className="text-sm text-red-500">{getErrorMessage()}</p>
                    </div>
                )}
                <Progress value={progress} className="h-1" />
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    {step > 0 && (
                        <Button
                            variant="ghost"
                            onClick={() => setStep(step - 1)}
                        >
                            Back
                        </Button>
                    )}
                    <div className="flex-1" />
                    <Button
                        onClick={() => {
                            if (step === 12) {
                                handleSubmit();
                            } else if (canProceedToNextStep()) {
                                setStep(step + 1);
                            }
                        }}
                        disabled={!canProceedToNextStep() || isSubmitting}
                        className={`${canProceedToNextStep() && !isSubmitting
                            ? 'bg-purple-500 hover:bg-purple-600'
                            : 'bg-gray-300 cursor-not-allowed'
                            } text-white`}
                    >
                        {isSubmitting
                            ? 'Publishing...'
                            : step === 0
                                ? 'Get started'
                                : step === 12
                                    ? 'Publish listing'
                                    : 'Next'
                        }
                    </Button>
                </div>
            </footer>
        </div>
    )
}
