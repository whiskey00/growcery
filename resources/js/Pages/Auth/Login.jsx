import { Head, Link, useForm } from '@inertiajs/react';

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

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center space-y-6">
                    {/* Logo */}
                    <Link href="/">
                        <img src="/images/green.png" alt="Growcery Logo" className="w-auto h-auto hover:opacity-90 transition" /> 
                    </Link>

                    {/* Login box */}
                    <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">Log in</h1>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full mt-1 p-2 border rounded"
                                    required
                                />
                                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full mt-1 p-2 border rounded"
                                    required
                                />
                                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between items-center pt-2">
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-gray-600 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                )}

                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    disabled={processing}
                                >
                                    {processing ? 'Logging in...' : 'Login'}
                                </button>
                            </div>
                        </form>

                        <p className="text-sm text-center text-gray-600 mt-6">
                            Don't have an account? <Link href="/register" className="text-green-600 hover:underline">Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
