'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentPage() {
    const [total, setTotal] = useState(300) // Example total amount

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Complete your payment</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6" action="#" method="POST">
                            <div>
                                <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                                    Card Number
                                </label>
                                <div className="mt-1">
                                    <Input id="card-number" name="card-number" type="text" placeholder="1234 5678 9012 3456" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700">
                                        Expiry Date
                                    </label>
                                    <div className="mt-1">
                                        <Input id="expiry-date" name="expiry-date" type="text" placeholder="MM/YY" required />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                                        CVC
                                    </label>
                                    <div className="mt-1">
                                        <Input id="cvc" name="cvc" type="text" placeholder="123" required />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name on Card
                                </label>
                                <div className="mt-1">
                                    <Input id="name" name="name" type="text" required />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <div className="w-full">
                            <div className="flex justify-between mb-4">
                                <span className="font-semibold">Total:</span>
                                <span className="font-bold">${total}</span>
                            </div>
                            <Button className="w-full">Pay ${total}</Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}