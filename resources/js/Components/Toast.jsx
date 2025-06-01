import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';

const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationCircleIcon,
    info: InformationCircleIcon,
};

const colors = {
    success: 'bg-green-50 text-green-800',
    error: 'bg-red-50 text-red-800',
    warning: 'bg-yellow-50 text-yellow-800',
    info: 'bg-blue-50 text-blue-800',
};

const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
};

export default function Toast({ message, type = 'success', show, onClose }) {
    const [isVisible, setIsVisible] = useState(show);
    
    useEffect(() => {
        setIsVisible(show);
        if (show) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!isVisible) return null;

    const Icon = icons[type];

    return (
        <div className="fixed top-4 right-4 w-96 z-50 transform transition-all duration-300 ease-in-out">
            <div className={`rounded-lg p-4 shadow-lg ${colors[type]}`}>
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <Icon className={`h-6 w-6 ${iconColors[type]}`} aria-hidden="true" />
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium">{message}</p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                        <button
                            type="button"
                            className={`inline-flex rounded-md ${colors[type]} hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                            onClick={() => {
                                setIsVisible(false);
                                onClose();
                            }}
                        >
                            <span className="sr-only">Close</span>
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 