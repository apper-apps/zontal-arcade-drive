// Mock AdSense settings data
const mockAdsenseSettings = [
  {
    Id: 1,
    publisherId: "pub-XXXXXXXXXXXXXXXX",
    metaTag: "ca-pub-XXXXXXXXXXXXXXXX",
    verificationCode: "YOUR_VERIFICATION_CODE_HERE",
    adsTxtContent: "google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0",
    adUnitIds: [],
    textContent: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Simulate database operations with delays
let nextId = 2;

export const getAll = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [...mockAdsenseSettings];
};

export const getById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const settings = mockAdsenseSettings.find(setting => setting.Id === parseInt(id));
  if (!settings) {
    throw new Error('AdSense settings not found');
  }
  return { ...settings };
};

export const getCurrent = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  // Return the first (and typically only) AdSense configuration
  const current = mockAdsenseSettings[0];
  return current ? { ...current } : null;
};

export const create = async (settingsData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newSettings = {
    Id: nextId++,
    publisherId: settingsData.publisherId || "",
    metaTag: settingsData.metaTag || "",
    verificationCode: settingsData.verificationCode || "",
    adsTxtContent: settingsData.adsTxtContent || "",
    adUnitIds: settingsData.adUnitIds || [],
    textContent: settingsData.textContent || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockAdsenseSettings.push(newSettings);
  return { ...newSettings };
};

export const update = async (id, settingsData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockAdsenseSettings.findIndex(setting => setting.Id === parseInt(id));
  if (index === -1) {
    throw new Error('AdSense settings not found');
  }
  
  mockAdsenseSettings[index] = {
    ...mockAdsenseSettings[index],
    ...settingsData,
    updatedAt: new Date().toISOString()
  };
  
  return { ...mockAdsenseSettings[index] };
};

export const updateCurrent = async (settingsData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (mockAdsenseSettings.length === 0) {
    // Create new settings if none exist
    return await create(settingsData);
  }
  
  // Update the first settings record
  return await update(mockAdsenseSettings[0].Id, settingsData);
};

export const remove = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockAdsenseSettings.findIndex(setting => setting.Id === parseInt(id));
  if (index === -1) {
    throw new Error('AdSense settings not found');
  }
  
  mockAdsenseSettings.splice(index, 1);
  return true;
};