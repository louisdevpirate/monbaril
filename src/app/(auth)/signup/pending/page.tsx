"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SignupPendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center px-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Vérifiez votre email
          </h1>
          <p className="text-gray-600">
            Nous avons envoyé un lien de confirmation à votre adresse email.
          </p>
        </div>

        <div className="space-y-4 text-sm text-gray-600">
          <p>📧 Consultez votre boîte de réception</p>
          <p>🔗 Cliquez sur le lien de confirmation</p>
          <p>✅ Finalisez votre inscription</p>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Si vous ne recevez pas l'email dans les 5 minutes, vérifiez vos spams ou réessayez.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Link
            href="/signup"
            className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Renvoyer l'email
          </Link>
          <Link
            href="/login"
            className="block w-full text-orange-500 hover:text-orange-700 font-medium"
          >
            Retour à la connexion
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
