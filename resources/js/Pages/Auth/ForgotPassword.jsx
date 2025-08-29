import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />

            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center space-y-6 w-full max-w-md">
                    {/* Logo */}
                    <Link href="/">
                        <img src="/images/green.png" alt="Growcery Logo" className="w-auto h-auto hover:opacity-90 transition" />
                    </Link>

                    {/* Forgot Password box */}
                    <div className="bg-white w-full p-8 rounded-lg shadow-md border border-gray-200">
                        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">Forgot Password</h1>

                        <div className="mb-6 text-sm text-gray-600 text-center">
                            Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
                        </div>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600 text-center">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    autoComplete="email"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Sending...' : 'Email Password Reset Link'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                href={route('login')}
                                className="text-sm font-medium text-green-600 hover:text-green-500"
                            >
                                ← Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
