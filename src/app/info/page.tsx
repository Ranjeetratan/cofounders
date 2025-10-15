import Link from 'next/link';

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">CofounderBase - Testing Information</h1>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔗 URLs</h2>
              <div className="space-y-2">
                <p><strong>Homepage:</strong> <Link href="/" className="text-accent hover:underline">http://localhost:3000/</Link></p>
                <p><strong>Directory:</strong> <a href="/directory" className="text-accent hover:underline">http://localhost:3000/directory</a></p>
                <p><strong>Submit Profile:</strong> <a href="/submit" className="text-accent hover:underline">http://localhost:3000/submit</a></p>
                <p><strong>Admin Panel:</strong> <a href="/secure-admin-panel-2024" className="text-accent hover:underline">http://localhost:3000/secure-admin-panel-2024</a></p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔐 Admin Login</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p><strong>Password:</strong> <code className="bg-gray-200 px-2 py-1 rounded">CofounderBase@2024!Secure</code></p>
                <p className="text-sm text-gray-600 mt-2">
                  Use this password to access the secure admin panel at /secure-admin-panel-2024
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">✨ Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">User Features</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Multi-step profile submission form</li>
                    <li>• Different forms for Founders vs Co-founders</li>
                    <li>• Profile picture upload</li>
                    <li>• Review step before submission</li>
                    <li>• Individual profile pages</li>
                    <li>• Profile sharing functionality</li>
                    <li>• Advanced filtering in directory</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Admin Features</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Profile approval/rejection</li>
                    <li>• Featured profile management</li>
                    <li>• Dynamic settings management</li>
                    <li>• Add/remove industries</li>
                    <li>• Add/remove skills</li>
                    <li>• Add/remove startup stages</li>
                    <li>• Real-time statistics</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">🚀 Getting Started</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">1. Test Profile Submission</h4>
                  <p className="text-blue-800 text-sm">
                    Go to <a href="/submit" className="underline">/submit</a> and create a test profile. 
                    The form has 4 steps including a review step.
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">2. Admin Approval</h4>
                  <p className="text-green-800 text-sm">
                    Go to <a href="/secure-admin-panel-2024" className="underline">/secure-admin-panel-2024</a>, login with the secure password, 
                    and approve the submitted profile.
                  </p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">3. View Directory</h4>
                  <p className="text-purple-800 text-sm">
                    Check <a href="/directory" className="underline">/directory</a> to see approved profiles 
                    and test the filtering functionality.
                  </p>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 mb-2">4. Manage Settings</h4>
                  <p className="text-orange-800 text-sm">
                    In the admin panel, go to the "Settings" tab to add/remove industries, 
                    skills, and startup stages.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">📱 Profile Pages</h2>
              <p className="text-gray-600 mb-2">
                Each approved profile gets its own shareable page at:
              </p>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                http://localhost:3000/profile/[profile-id]
              </code>
              <p className="text-sm text-gray-500 mt-2">
                You can access these from the "View Profile" button on profile cards in the directory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}