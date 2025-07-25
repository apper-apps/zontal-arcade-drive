// Mock content data
const mockContents = [
  {
    Id: 1,
    type: "about",
    title: "About Arcade Flow",
    content: "Welcome to Arcade Flow, your premier destination for HTML5 games!\n\nWe are passionate about bringing you the best gaming experience directly in your browser. Our platform features a carefully curated collection of high-quality HTML5 games that work seamlessly across all devices.\n\nOur mission is to provide entertainment for everyone, from casual gamers looking for a quick break to dedicated players seeking their next adventure. We believe that great games should be accessible to all, which is why our platform is completely free to use.\n\nAt Arcade Flow, we're constantly working to expand our game library and improve your gaming experience. We welcome feedback and suggestions from our community."
  },
  {
    Id: 2,
    type: "contact",
    title: "Contact Us",
    content: "We'd love to hear from you! Get in touch with our team for support, feedback, or business inquiries.\n\nEmail Support:\nsupport@arcadeflow.com\n\nBusiness Inquiries:\nbusiness@arcadeflow.com\n\nGeneral Questions:\ninfo@arcadeflow.com\n\nResponse Time:\nWe aim to respond to all inquiries within 24-48 hours during business days.\n\nMailing Address:\nArcade Flow\n123 Gaming Street\nTech City, TC 12345\nUnited States\n\nHours of Operation:\nMonday - Friday: 9:00 AM - 6:00 PM PST\nWeekends: Limited support available"
  },
  {
    Id: 3,
    type: "privacy",
    title: "Privacy Policy",
    content: "Privacy Policy for Arcade Flow\n\nLast updated: [Date]\n\nIntroduction:\nAt Arcade Flow, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you use our gaming platform.\n\nInformation We Collect:\n• Anonymous usage data to improve our services\n• Browser information for compatibility\n• Game preferences and statistics\n• Feedback and communications you send us\n\nHow We Use Your Information:\n• To provide and maintain our service\n• To improve user experience\n• To analyze usage patterns\n• To respond to your inquiries\n\nData Security:\nWe implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.\n\nThird-Party Services:\nOur website may contain links to third-party sites. We are not responsible for their privacy practices.\n\nContact Us:\nIf you have questions about this Privacy Policy, please contact us at privacy@arcadeflow.com"
  },
  {
    Id: 4,
    type: "disclaimer",
    title: "Disclaimer",
    content: "Legal Disclaimer for Arcade Flow\n\nGeneral Information:\nThe information on this website is provided on an 'as is' basis. To the fullest extent permitted by law, Arcade Flow excludes all representations, warranties, obligations, and liabilities.\n\nGaming Content:\n• Games are provided for entertainment purposes only\n• We do not guarantee uninterrupted access to games\n• Game availability may vary and change without notice\n• Some games may contain content not suitable for all ages\n\nUser Responsibility:\n• Users are responsible for their own gaming activities\n• Parents should supervise children's gaming activities\n• Users should take regular breaks while gaming\n\nLimitation of Liability:\nArcade Flow shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our platform.\n\nExternal Links:\nOur platform may contain links to external websites. We do not endorse or take responsibility for the content of external sites.\n\nModifications:\nWe reserve the right to modify this disclaimer at any time without prior notice.\n\nGoverning Law:\nThis disclaimer is governed by the laws of [Jurisdiction]."
  }
];

// Simulate database operations with delays
let nextId = 5;

export const getAll = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [...mockContents];
};

export const getById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const content = mockContents.find(content => content.Id === parseInt(id));
  if (!content) {
    throw new Error('Content not found');
  }
  return { ...content };
};

export const getByType = async (type) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const content = mockContents.find(content => content.type === type);
  if (!content) {
    throw new Error('Content not found');
  }
  return { ...content };
};

export const create = async (contentData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newContent = {
    Id: nextId++,
    type: contentData.type,
    title: contentData.title,
    content: contentData.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockContents.push(newContent);
  return { ...newContent };
};

export const update = async (id, contentData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockContents.findIndex(content => content.Id === parseInt(id));
  if (index === -1) {
    throw new Error('Content not found');
  }
  
  mockContents[index] = {
    ...mockContents[index],
    ...contentData,
updatedAt: new Date().toISOString()
  };
  
  return { ...mockContents[index] };
};

export const remove = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockContents.findIndex(content => content.Id === parseInt(id));
  if (index === -1) {
    throw new Error('Content not found');
  }
  
  mockContents.splice(index, 1);
  return true;
};