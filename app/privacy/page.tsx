export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose">
                <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
                <p>We collect information that you provide directly to us when you:</p>
                <ul className="list-disc pl-6 mb-4">
                    <li>Create an account</li>
                    <li>Make a booking</li>
                    <li>Contact our support team</li>
                    <li>Sign in with Google</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 mb-4">
                    <li>Provide and maintain our services</li>
                    <li>Process your bookings</li>
                    <li>Send you important updates</li>
                    <li>Improve our services</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-4">3. Information Sharing</h2>
                <p>We do not sell your personal information. We may share your information only:</p>
                <ul className="list-disc pl-6 mb-4">
                    <li>With your consent</li>
                    <li>To comply with laws</li>
                    <li>To protect our rights</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-4">4. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                <p>Email: support@ezyrent.com</p>
            </div>
        </div>
    )
}