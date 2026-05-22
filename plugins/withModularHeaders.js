const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withModularHeaders(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      
      if (fs.existsSync(podfilePath)) {
        let podfileContent = fs.readFileSync(podfilePath, 'utf-8');
        
        // Check if use_modular_headers! is already present
        if (!podfileContent.includes('use_modular_headers!')) {
          // Add use_modular_headers! after the platform line
          podfileContent = podfileContent.replace(
            /(platform :ios.*\n)/,
            '$1\n# Fix for Firebase Swift pods\nuse_modular_headers!\n'
          );
          
          fs.writeFileSync(podfilePath, podfileContent);
          console.log('✅ Added use_modular_headers! to Podfile');
        }
      }
      
      return config;
    },
  ]);
};
