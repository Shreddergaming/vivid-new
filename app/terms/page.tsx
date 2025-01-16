export default function TermsOfService() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <div className="prose">
                <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
                <p>By accessing and using EzyRent, you accept and agree to be bound by these Terms of Service.</p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">2. User Accounts</h2>
                <ul className="list-disc pl-6 mb-4">
                    <li>You must provide accurate information when creating an account</li>
                    <li>You are responsible for maintaining the security of your account</li>
                    <li>You must not share your account credentials</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-4">3. Booking and Rentals</h2>
                <ul className="list-disc pl-6 mb-4">
                    <li>All bookings are subject to host approval</li>
                    <li>Cancellation policies are set by hosts</li>
                    <li>Users must follow property rules and guidelines</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-4">4. Prohibited Activities</h2>
                <p>Users must not:</p>
                <ul className="list-disc pl-6 mb-4">
                    <li>Violate any laws or regulations</li>
                    <li>Impersonate others</li>
                    <li>Submit false information</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-4">5. Contact Information</h2>
                <p>For any questions regarding these Terms, please contact us at:</p>
                <p>Email: support@ezyrent.com</p>
            </div>
        </div>
    )
}