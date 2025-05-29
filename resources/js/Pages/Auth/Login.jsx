import { Head, Link, useForm } from '@inertiajs/react';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from '@/firebase';
import axios from 'axios';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Send the Google user data to your Laravel backend
            const response = await axios.post('/login/google', {
                email: user.email,
                name: user.displayName,
                uid: user.uid,
            });

            // If successful, reload the page to complete the redirection
            if (response.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Google Sign-In error:", error);
            // You might want to show an error message to the user
            alert("Failed to sign in with Google. Please try again.");
        }
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center space-y-6 w-full max-w-md">
                    {/* Logo */}
                    <Link href="/">
                        <img src="/images/green.png" alt="Growcery Logo" className="w-auto h-auto hover:opacity-90 transition" />
                    </Link>

                    {/* Login box */}
                    <div className="bg-white w-full p-8 rounded-lg shadow-md border border-gray-200">
                        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">Log in</h1>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full mt-1 p-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    required
                                />
                                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full mt-1 p-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    required
                                />
                                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember me</label>
                            </div>

                            <div className="flex items-center justify-center pt-2 relative">
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-gray-600 hover:text-gray-800 absolute left-0 hover:underline transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                )}

                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                    disabled={processing}
                                >
                                    {processing ? 'Logging in...' : 'Login'}
                                </button>
                            </div>
                        </form>

                        {/* Divider with "or" */}
                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">or</span>
                            </div>
                        </div>

                        {/* Google Sign-In */}
                        <div className="mt-6">
                            <button
                                onClick={handleGoogleSignIn}
                                className="w-full flex items-center justify-center bg-white border-2 border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <img src="/images/google-icon.svg" alt="Google" className="w-5 h-5 mr-3" />
                                <span className="font-medium">Continue with Google</span>
                            </button>
                        </div>

                        <p className="text-sm text-center text-gray-600 mt-8">
                            Don't have an account? <Link href="/register" className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors">Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
