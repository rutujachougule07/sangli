// Static site data — replace with Firebase / Cloud later.
import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";

export const ORG = {
  name: "Bhagini Nivedita Pratishthan",
  name_mr: "भगिनी निवेदिता प्रतिष्ठान",
  short: "BNP",
  city: "Sangli",
  tagline: "Empowering lives through education, skill & seva.",
  address: "Nivedita Bhavan, Ganesh Durg, Rajwada, Sangli - 416416",
  phone: "09960061970",

  email: "bnpsangli@gmail.com",
  registrationNo: "E 294 Sangli",
  registrationDate: "08/01/1971",
  incorporationDate: "01/07/1970",
};

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  {
    to: "/courses",
    label: "Courses",
  },
  { to: "/news", label: "Gallery" },
  { to: "/contribute", label: "Contribute" },
  { to: "/contact", label: "Contact" },
];

export const STATS = [
  { value: 55, suffix: "+", label: "Years of Service" },
  { value: 12000, suffix: "+", label: "Lives Impacted" },
  { value: 10, suffix: "+", label: "Skill Courses" },
  { value: 130, suffix: "+", label: "Success Stories" },
];

export const HIGHLIGHTS = [
  {
    title: "Achievements",
    desc: "Five decades of recognised social work in education, women empowerment and elder care.",
    icon: "Shield",
  },
  {
    title: "Our Courses",
    desc: "Hands-on, industry-aligned courses for nursing, IT, design and more.",
    icon: "GraduationCap",
  },
  {
    title: "Contribution",
    desc: "Driven by donations, volunteers and community partnerships.",
    icon: "Users",
  },
];

export const MILESTONES = [
  { year: "1970", text: "Started hostel in Rajwada, Started working outside Sangli.", text_mr: "राजवाड्यात वसतिगृह सुरू केले, सांगलीबाहेर काम सुरू केले." },
  { year: "1975", text: "Conducted many camps for women and children all over Maharashtra.", text_mr: "महाराष्ट्रात महिला व मुलांसाठी अनेक शिबिरे आयोजित केली." },
  { year: "1977", text: "Branch started in Goa.", text_mr: "गोव्यात शाखा सुरू झाली." },
  { year: "1980", text: "National Adult Education programme and Zoolaghar (creche) started. Public participation camps conducted in KA, AP, UP, Goa and Gujarat. Sanstha got 2nd prize in Adult Education.", text_mr: "राष्ट्रीय प्रौढ शिक्षण आणि पाळणाघर (झुलाघर) कार्यक्रम सुरू. कर्नाटक, आंध्र, उत्तर प्रदेश, गोवा, गुजरातमध्ये जाहीर सहभाग शिबिरे. संस्थेला प्रौढ शिक्षणात द्वितीय पुरस्कार मिळाला." },
  { year: "1985", text: "286 Zoolaghars and central kitchen started.", text_mr: "२८६ झुलाघरे आणि मध्यवर्ती स्वयंपाकघर सुरू झाले." },
  { year: "1991", text: "Asia's first NGO HIV rehabilitation center started at Yashwantnagar. Carpet manufacturing started, won 1st prize. Dr. Kusumtai Ghanekar visited Trinidad.", text_mr: "यशवंतनगर येथे आशियातील पहिले स्वयंसेवी संस्था HIV पुनर्वसन केंद्र सुरू. गालिचा विणकामात प्रथम पुरस्कार. डॉ. कुसुमताई घाणेकर त्रिनिदादला गेल्या." },
  { year: "1992", text: "Family counseling centers and Working women's hostels started in Sangli and Nagpur.", text_mr: "सांगली आणि नागपुरात कौटुंबिक सल्लागार केंद्रे आणि नोकरी करणाऱ्या महिलांचे वसतिगृह सुरू." },
  { year: "1994", text: "Balgruha for daughters of Devdasis started at Jath, Balsadan for special girls started at Yashwantnagar.", text_mr: "जत येथे देवदासींच्या मुलींसाठी बालगृह, यशवंतनगर येथे विशेष मुलींसाठी बालसदन सुरू." },
  { year: "1997", text: "Started Balagruha at Yashwantnagar.", text_mr: "यशवंतनगर येथे बालगृह सुरू केले." },
  { year: "2003", text: "Started Swadhar Gruha at Yashwantnagar.", text_mr: "यशवंतनगर येथे स्वाधार गृह सुरू केले." },
  { year: "2016", text: "Started vocational training centre.", text_mr: "व्यावसायिक प्रशिक्षण केंद्र सुरू केले." },
  { year: "2023", text: "Started Annapoorna course for needy women.", text_mr: "गरजू महिलांसाठी अन्नपूर्णा कोर्स सुरू केला." },
  { year: "2026", text: "Kamaltai Jog Mahila Vasatigruha at Jath. Nivedita bakery -trainig and production at Rajwada Campus.", text_mr: "जत येथे कमलताई जोग महिला वसतिगृह. राजवाडा परिसर येथे निवेदिता बेकरी - प्रशिक्षण आणि उत्पादन." }
];

export const TEAM = [
  {
    name: "Neeta Damle",
    name_mr: "नीता दामले",
    role: "President",
    initials: "ND",
    description: "Working for BNP since 1990",
    description_mr: "१९९० पासून बी.एन.पी. साठी कार्यरत"
  },
  {
    name: "Dr. Anita Page",
    name_mr: "डॉ. अनिता पेज",
    role: "Vice President",
    initials: "AP",
    description: "Active member of IMA, in charge of geriatric care course",
    description_mr: "आय.एम.ए. च्या सक्रिय सदस्या, जेरियाट्रिक केअर कोर्सच्या प्रभारी"
  },
  {
    name: "Vineeta Telang",
    name_mr: "विनीता तेलंग",
    role: "Secretary",
    initials: "VT",
    description: "Own Business, contributing in social work since 1983",
    description_mr: "स्वतःचा व्यवसाय, १९८३ पासून सामाजिक कार्यात योगदान"
  },
  {
    name: "Prateeksha Joshi",
    name_mr: "प्रतीक्षा जोशी",
    role: "Joint Secretary",
    initials: "PJ",
    description: "Expert in computer, joint secretary",
    description_mr: "संगणक तज्ज्ञ, सहसचिव"
  },
  {
    name: "Nileema Bhilawdikar",
    name_mr: "नीलिमा भिलावडीकर",
    role: "Treasurer",
    initials: "NB",
    description: "JBL Bank officer",
    description_mr: "जे.बी.एल. बँक अधिकारी"
  },
  {
    name: "Ruta Jog",
    name_mr: "रुता जोग",
    role: "Joint Treasurer",
    initials: "RJ",
    description: "Own business, joint treasurer",
    description_mr: "स्वतःचा व्यवसाय, सह-खजिनदार"
  },
  {
    name: "Vidya Kale",
    name_mr: "विद्या काळे",
    role: "Member",
    initials: "VK",
    description: "Own business, in charge of Annapoorna course",
    description_mr: "स्वतःचा व्यवसाय, अन्नपूर्णा कोर्सच्या प्रभारी"
  },
  {
    name: "Dr. Sharduli Terwadkar",
    name_mr: "डॉ. शार्डुली टेरवाडकर",
    role: "Member",
    initials: "ST",
    description: "Expert in Ayurveda, connected with many International organisations",
    description_mr: "आयुर्वेद तज्ज्ञ, अनेक आंतरराष्ट्रीय संस्थांशी जोडलेल्या"
  },
  {
    name: "Kavyashree Nalawade",
    name_mr: "काव्यश्री नलवडे",
    role: "Member",
    initials: "KN",
    description: "Business owner",
    description_mr: "व्यवसाय मालक"
  },
  {
    name: "Megha Gawade",
    name_mr: "मेघा गावडे",
    role: "Member",
    initials: "MG",
    description: "Business owner",
    description_mr: "व्यवसाय मालक"
  },
  {
    name: "Anagha Limaye",
    name_mr: "अनघा लिमये",
    role: "Member",
    initials: "AL",
    description: "Teacher and Nutritionist",
    description_mr: "शिक्षिका आणि पोषणतज्ज्ञ"
  },
  {
    name: "Shubhada Gokhale",
    name_mr: "शुभदा गोखले",
    role: "Member",
    initials: "SG",
    description: "Teacher",
    description_mr: "शिक्षिका"
  },
  {
    name: "Nasim Sheikh",
    name_mr: "नसीम शेख",
    role: "Member",
    initials: "NS",
    description: "Ex president BNP",
    description_mr: "माजी अध्यक्षा, बी.एन.पी."
  }
];

export const NEWS = [
  {
    id: "1",
    title: "New Batch of Nursing Assistants Graduates",
    category: "Education",
    date: "2025-03-12",
    image: news1,
    excerpt:
      "32 students completed their Nursing Assistant certification with placements at city hospitals.",
  },
  {
    id: "2",
    title: "Free Tally & MS-Office Camp for Women",
    category: "Skill",
    date: "2025-02-04",
    image: news2,
    excerpt:
      "A two-week camp introduced 80+ women to office productivity tools and basic accounting.",
  },
  {
    id: "3",
    title: "Geriatric Care Drive in Rural Sangli",
    category: "Health",
    date: "2025-01-22",
    image: news3,
    excerpt: "BNP volunteers visited 14 villages providing health check-ups for senior citizens.",
  },
  {
    id: "4",
    title: "Annapoorna Programme Reaches 1,000 Meals/Day",
    category: "Community",
    date: "2024-12-10",
    image: news1,
    excerpt: "Our community kitchen now serves over a thousand wholesome meals every single day.",
  },
  {
    id: "5",
    title: "Beauty & Fashion Designing Showcase",
    category: "Skill",
    date: "2024-11-18",
    image: news2,
    excerpt: "Students presented their term-end collection at a vibrant local exhibition.",
  },
  {
    id: "6",
    title: "Web Development Cohort Launches Portfolios",
    category: "Skill",
    date: "2024-10-02",
    image: news3,
    excerpt: "First batch of web development students published their personal portfolios online.",
  },
];

export const NEWS_CATEGORIES = ["All", "Education", "Skill", "Health", "Community"] as const;

export type Course = {
  id: string;
  name: string;
  name_mr: string;
  eligibility: string;
  eligibility_mr: string;
  duration: string;
  duration_mr: string;
  fees: string;
  fees_mr: string;
  accreditation: string;
  accreditation_mr: string;
  format: string;
  format_mr: string;
  description?: string;
  description_mr?: string;
  image?: string;
};

export const COURSES: Course[] = [
  {
    id: "c9",
    name: "Beauty & Wellness",
    name_mr: "ब्युटी आणि वेलनेस",
    eligibility: "10th Pass",
    eligibility_mr: "१० वी पास",
    duration: "6 Months",
    duration_mr: "६ महिने",
    fees: "₹6,000",
    fees_mr: "₹६,०००",
    accreditation: "NSDC (Skill India)",
    accreditation_mr: "NSDC (कौशल्य भारत)",
    format: "Theory and practical",
    format_mr: "थियरी आणि प्रॅक्टिकल",
    description: "Basic skin care, hair styling, makeup techniques, and personal grooming skills.",
    description_mr: "मूलभूत त्वचा काळजी, हेअर स्टाईल, मेकअप तंत्र आणि वैयक्तिक ग्रूमिंग कौशल्ये."
  },
  {
    id: "c10",
    name: "Tailoring & Fashion Designing",
    name_mr: "टेलरिंग आणि फॅशन डिझायनिंग",
    eligibility: "10th Pass",
    eligibility_mr: "१० वी पास",
    duration: "6 Months",
    duration_mr: "६ महिने",
    fees: "₹6,000",
    fees_mr: "₹६,०००",
    accreditation: "NSDC (Skill India)",
    accreditation_mr: "NSDC (कौशल्य भारत)",
    format: "Theory and practical",
    format_mr: "थियरी आणि प्रॅक्टिकल",
    description: "Stitching, garment cutting, dress designing, and modern fashion trends.",
    description_mr: "शिवणकाम, कपडे कटिंग, ड्रेस डिझायनिंग आणि आधुनिक फॅशन ट्रेंड्स."
  },
  {
    id: "c11",
    name: "Annapoorna",
    name_mr: "अन्नपूर्णा",
    eligibility: "Literate",
    eligibility_mr: "साक्षर",
    duration: "3 Months",
    duration_mr: "३ महिने",
    fees: "₹3,000",
    fees_mr: "₹३,०००",
    accreditation: "BNP",
    accreditation_mr: "बी.एन.पी.",
    format: "Theory with demo",
    format_mr: "थियरी आणि प्रात्यक्षिक डेमो",
    description: "Catering training, recipe creation, kitchen hygiene, and home food business management.",
    description_mr: "केटरिंग प्रशिक्षण, पाककृती निर्मिती, स्वयंपाकघरातील स्वच्छता आणि घरगुती अन्न व्यवसाय व्यवस्थापन."
  },
  {
    id: "c5",
    name: "M.S. Office Basic",
    name_mr: "एम.एस. ऑफिस बेसिक",
    eligibility: "10th Pass",
    eligibility_mr: "१० वी पास",
    duration: "3 Months",
    duration_mr: "३ महिने",
    fees: "₹2,000",
    fees_mr: "₹२,०००",
    accreditation: "NSDC (Skill India)",
    accreditation_mr: "NSDC (कौशल्य भारत)",
    format: "Online training on separate PC",
    format_mr: "स्वतंत्र संगणकावर ऑनलाइन प्रशिक्षण",
    description: "Essential computer skills including Word, Excel, PowerPoint, and basic internet operations.",
    description_mr: "वर्ड, एक्सेल, पॉवरपॉइंट आणि मूलभूत इंटरनेट वापरासह आवश्यक संगणक कौशल्ये."
  },
  {
    id: "c6",
    name: "Advance Excel",
    name_mr: "अ‍ॅडव्हान्स एक्सेल",
    eligibility: "10th Pass",
    eligibility_mr: "१० वी पास",
    duration: "3 Months",
    duration_mr: "३ महिने",
    fees: "₹2,000",
    fees_mr: "₹२,०००",
    accreditation: "NSDC (Skill India)",
    accreditation_mr: "NSDC (कौशल्य भारत)",
    format: "Online training on separate PC",
    format_mr: "स्वतंत्र संगणकावर ऑनलाइन प्रशिक्षण",
    description: "In-depth Excel functions, formulas, data analysis, and dashboard preparation.",
    description_mr: "सखोल एक्सेल फंक्शन्स, फॉर्म्युले, डेटा विश्लेषण आणि डॅशबोर्ड निर्मितीचे प्रशिक्षण."
  },
  {
    id: "c7",
    name: "Advance Tally",
    name_mr: "अ‍ॅडव्हान्स टॅली",
    eligibility: "10th Pass",
    eligibility_mr: "१० वी पास",
    duration: "3 Months",
    duration_mr: "३ महिने",
    fees: "₹2,000",
    fees_mr: "₹२,०००",
    accreditation: "NSDC (Skill India)",
    accreditation_mr: "NSDC (कौशल्य भारत)",
    format: "Online training on separate PC",
    format_mr: "स्वतंत्र संगणकावर ऑनलाइन प्रशिक्षण",
    description: "Professional accounting, GST filing, taxation, and business management with Tally.",
    description_mr: "टॅली सॉफ्टवेअर वापरून व्यावसायिक अकाउंटिंग, जीएसटी फायलिंग, कर आकारणी आणि व्यवसाय व्यवस्थापन."
  },
  {
    id: "c8",
    name: "Web Development",
    name_mr: "वेब डेव्हलपमेंट",
    eligibility: "10th Pass",
    eligibility_mr: "१० वी पास",
    duration: "3 Months",
    duration_mr: "३ महिने",
    fees: "₹2,000",
    fees_mr: "₹२,०००",
    accreditation: "Vatsaly Trust",
    accreditation_mr: "वात्सल्य ट्रस्ट",
    format: "Online training on separate PC",
    format_mr: "स्वतंत्र संगणकावर ऑनलाइन प्रशिक्षण",
    description: "Introduction to HTML, CSS, JavaScript, and building responsive websites.",
    description_mr: "HTML, CSS, JavaScript चा परिचय आणि रिस्पॉन्सिव्ह वेबसाईट्स तयार करण्याचे प्रशिक्षण."
  },
  {
    id: "c9",
    name: "Beauty & Wellness",
    name_mr: "ब्युटी आणि वेलनेस",
    eligibility: "10th Pass",
    eligibility_mr: "१० वी पास",
    duration: "6 Months",
    duration_mr: "६ महिने",
    fees: "₹6,000",
    fees_mr: "₹६,०००",
    accreditation: "NSDC (Skill India)",
    accreditation_mr: "NSDC (कौशल्य भारत)",
    format: "Theory and practical",
    format_mr: "थियरी आणि प्रॅक्टिकल",
    description: "Basic skin care, hair styling, makeup techniques, and personal grooming skills.",
    description_mr: "मूलभूत त्वचा काळजी, हेअर स्टाईल, मेकअप तंत्र आणि वैयक्तिक ग्रूमिंग कौशल्ये."
  },
  {
    id: "c10",
    name: "Tailoring & Fashion Designing",
    name_mr: "टेलरिंग आणि फॅशन डिझायनिंग",
    eligibility: "10th Pass",
    eligibility_mr: "१० वी पास",
    duration: "6 Months",
    duration_mr: "६ महिने",
    fees: "₹6,000",
    fees_mr: "₹६,०००",
    accreditation: "NSDC (Skill India)",
    accreditation_mr: "NSDC (कौशल्य भारत)",
    format: "Theory and practical",
    format_mr: "थियरी आणि प्रॅक्टिकल",
    description: "Stitching, garment cutting, dress designing, and modern fashion trends.",
    description_mr: "शिवणकाम, कपडे कटिंग, ड्रेस डिझायनिंग आणि आधुनिक फॅशन ट्रेंड्स."
  },
  {
    id: "c11",
    name: "Annapoorna",
    name_mr: "अन्नपूर्णा",
    eligibility: "Literate",
    eligibility_mr: "साक्षर",
    duration: "3 Months",
    duration_mr: "३ महिने",
    fees: "₹3,000",
    fees_mr: "₹३,०००",
    accreditation: "BNP",
    accreditation_mr: "बी.एन.पी.",
    format: "Theory with demo",
    format_mr: "थियरी आणि प्रात्यक्षिक डेमो",
    description: "Catering training, recipe creation, kitchen hygiene, and home food business management.",
    description_mr: "केटरिंग प्रशिक्षण, पाककृती निर्मिती, स्वयंपाकघरातील स्वच्छता आणि घरगुती अन्न व्यवसाय व्यवस्थापन."
  },
  {
    id: "c12",
    name: "Short Cookery Courses",
    name_mr: "कुकरी शॉर्ट कोर्सेस",
    eligibility: "Literate",
    eligibility_mr: "साक्षर",
    duration: "2 Days",
    duration_mr: "२ दिवस",
    fees: "₹600 - ₹1,000",
    fees_mr: "₹६०० ते ₹१,०००",
    accreditation: "BNP",
    accreditation_mr: "बी.एन.पी.",
    format: "Demo, sample taste, printed notes",
    format_mr: "डेमो, नमुना आस्वाद, छापील नोट्स",
    description: "Intensive quick workshops for learning popular recipes, techniques, and presentation.",
    description_mr: "लोकप्रिय पाककृती, तंत्रे आणि सादरीकरण शिकण्यासाठी सखोल आणि जलद कार्यशाळा."
  },
  {
    id: "c13",
    name: "Saral Sewa Preparation",
    name_mr: "सरळसेवा भरती पूर्वतयारी",
    eligibility: "10th / 12th Pass",
    eligibility_mr: "१० वी / १२ वी पास",
    duration: "1 to 3 Years",
    duration_mr: "१ ते ३ वर्षे",
    fees: "Reasonable price",
    fees_mr: "वाजवी किंमत",
    accreditation: "BNP Project",
    accreditation_mr: "बी.एन.पी. प्रकल्प",
    format: "Hostel facility, theory & physical training",
    format_mr: "वसतिगृह सुविधा, थियरी आणि शारीरिक प्रशिक्षण",
    description: "Comprehensive coaching for direct recruitment exams along with fitness guidance and boarding.",
    description_mr: "थेट भरती परीक्षांसाठी सर्वसमावेशक कोचिंग, सोबत फिटनेस मार्गदर्शन आणि निवास व्यवस्था."
  }
];

export const TESTIMONIALS = [
  {
    name: "Sayali",
    role: "Graphic Designer",
    content: "Sayali joined BNP project at the age of 12. With three siblings and a single mother at home, she carried a significant share of family responsibilities from a young age. Alongside her education, she completed vocational training in stitching bags and purses. An enthusiastic participant in every activity and initiative of the institution, Sayali consistently demonstrated determination and creativity. Today, she works as a Graphic Designer, building a successful career through her hard work and perseverance.",
    avatar: "SY"
  },
  {
    name: "Dipali",
    role: "Caretaker at NGO",
    content: "Being orphaned at an early age, Dipali came to the children's home with no known family identity. Talented in rangoli art and singing, she was always eager to learn new skills. She had a special interest in cooking and would often learn new recipes from the staff while completing her education at the home. Today, Dipali works as a Caretaker with a non-governmental organization, where she is highly valued for her dedication and compassionate nature.",
    avatar: "DP"
  },
  {
    name: "Snehal",
    role: "Ganesh Sculptor",
    content: "Snehal came from a single-parent family and lived in the children's home along with her sister, Jyoti. During her stay, she completed her education and received vocational training in tailoring. Always eager to participate and excel in every activity, Snehal displayed remarkable creativity and confidence. Today, she is a skilled sculptor who crafts beautiful Ganesh idols. She also runs a tailoring business from home and manages her family life with equal dedication.",
    avatar: "SN"
  },
  {
    name: "Amruta",
    role: "Ladies' Gym Trainer",
    content: "Amruta joined the institution from a single-parent family background. She successfully completed her education while actively participating in various activities and events. Passionate about fitness, she maintained a disciplined exercise routine and built strong friendships with everyone around her. Her enthusiasm and commitment eventually led her to pursue a career in the field she loved most. Today, Amruta works as a Ladies' Gym Trainer and finds immense satisfaction in helping others achieve their fitness goals.",
    avatar: "AM"
  },
  {
    name: "Shubhangi",
    role: "Trained Nurse",
    content: "Shubhangi, the daughter of a tribal farm labourer from Vidarbha, came to pursue a Nursing Care course. Determined to build a better future, she worked in the fields and saved money for her travel and education. Exceptionally talented, energetic, and an excellent sportsperson, she embraced every opportunity to learn. Later, she completed an Operation Theatre (OT) Technician course through the institution. Today, she is employed at a private hospital in Yavatmal with a respectable salary and is simultaneously pursuing the RGNM nursing qualification to further advance her career.",
    avatar: "SH"
  },
  {
    name: "Sameena",
    name_mr: "समीना",
    role: "Kind caregiver",
    role_mr: "काळजीवाहू (Caregiver)",
    content: "Despite struggling with obesity and low self-confidence, Sameena enrolled in the Nursing Care course with a strong desire to acquire skills and build a respectable career. Kind-hearted, dedicated, and hardworking, she developed expertise in home nursing services and today earns well while providing quality care to those in need.",
    content_mr: "स्थूलता आणि कमी आत्मविश्वासाचा सामना करत असतानाही, कौशल्यांचे संपादन करण्यासाठी आणि एक सन्मानजनक करिअर घडवण्यासाठी समीनाने नर्सिंग केअर कोर्समध्ये प्रवेश घेतला. दयाळू, समर्पित आणि कष्टाळू वृत्तीने तिने होम नर्सिंग सेवांमध्ये नैपुण्य मिळवले आणि आज ती गरजूंची उत्तम काळजी घेत चांगली कमाई करत आहे.",
    avatar: "SM"
  },
  {
    name: "Asma",
    name_mr: "अस्मा",
    role: "Trained Nurse",
    role_mr: "प्रशिक्षित नर्स",
    content: "Asma joined the course while managing a serious blood-related medical condition. She wanted to better understand her illness, support her own treatment expenses, and contribute to her family's financial needs. Through determination and hard work, she built a successful career in healthcare. Today, Asma is employed at a private hospital with a good salary, bringing financial stability and peace of mind to her family.",
    content_mr: "रक्ताशी संबंधित गंभीर आजाराचा सामना करत असतानाच अस्माने या कोर्समध्ये प्रवेश घेतला. तिला आपल्या आजाराबद्दल अधिक समजून घ्यायचे होते, स्वतःच्या उपचाराचा खर्च उचलायचा होता आणि कुटुंबाच्या आर्थिक गरजांना हातभार लावायचा होता. जिद्द आणि कठोर परिश्रमाच्या जोरावर तिने आरोग्य सेवा क्षेत्रात एक यशस्वी करिअर घडवले. आज अस्मा एका खाजगी रुग्णालयात चांगल्या पगारावर नोकरी करत असून, तिच्यामुळे तिच्या कुटुंबाला आर्थिक स्थैर्य आणि मानसिक शांतता लाभली आहे.",
    avatar: "AS"
  },
  {
    name: "Sujata",
    name_mr: "सुजाता",
    role: "Working professional in SARATHI",
    role_mr: "सारथी (SARATHI) मध्ये कार्यरत",
    content: "After losing both her parents, Sujata was admitted to the children's home by an employee of the State Transport Department. She spent ten years at the children's home in Jat, where she grew into a bright, friendly, and capable young woman. With the institution's support, she completed her Master of Computer Applications (MCA) degree. Today, Sujata is working with the organization Sarathi, contributing meaningfully to society through her professional work.",
    content_mr: "आपल्या आई-वडिलांच्या निधनानंतर, सुजाताला राज्य परिवहन विभागाच्या (एसटी) एका कर्मचाऱ्याने बालगृहात दाखल केले. जत येथील बालगृहात तिने दहा वर्षे घालवली, जिथे ती एक हुशार, मनमिळावू आणि सक्षम तरुणी म्हणून मोठी झाली. संस्थेच्या पाठिंब्यामुळे तिने संगणक उपयोजन पदव्युत्तर पदवी (MCA) पूर्ण केली. आज सुजाता 'सारथी' संस्थेत कार्यरत असून, आपल्या व्यावसायिक कार्यातून समाजात मोलाचे योगदान देत आहे.",
    avatar: "SJ"
  },
  {
    name: "Sakshi",
    name_mr: "साक्षी",
    role: "Proud Agniveer",
    role_mr: "अग्निवीर",
    content: "Sakshi came to the institution as a complete orphan and spent ten years in the children's home. She completed her education up to Grade 12 and then joined a Police Recruitment Academy to prepare for a career in public service. Determined to serve the nation, she later enrolled in the Agniveer Scheme and was successfully selected for the Indian Army. Today, she is proudly serving the country while posted in Jammu and Kashmir.",
    content_mr: "साक्षी पूर्णपणे अनाथ म्हणून संस्थेत आली आणि तिने बालगृहात दहा वर्षे घालवली. तिने १२ वी पर्यंतचे शिक्षण पूर्ण केले आणि त्यानंतर सार्वजनिक सेवेत करिअर करण्यासाठी ती पोलीस भरती पूर्वतयारी अकॅडमीमध्ये सामील झाली. देशाची सेवा करण्याच्या जिद्दीने तिने नंतर अग्निवीर योजनेत प्रवेश मिळवला आणि भारतीय सैन्यात तिची निवड झाली. आज ती जम्मू आणि काश्मीर येथे तैनात असून अभिमानाने देशाची सेवा करत आहे.",
    avatar: "SK"
  },
  {
    name: "Anushka",
    name_mr: "अनुष्का",
    role: "Trainee to entrepreneur",
    role_mr: "प्रशिक्षणार्थी ते उद्योजिका",
    content: "When Anushka joined the Annapurna course, cooking was already a familiar skill. She had previously run a home-based food business for six years, but the venture was forced to close during the COVID-19 pandemic. Looking to rebuild her business, she felt the need for updated skills and renewed confidence. During the three-month course, she participated in food stalls and practical activities that helped restore her entrepreneurial spirit. Today, Anushka successfully takes orders for a variety of homemade food products and regularly operates food stalls, once again building a thriving livelihood through her passion for cooking.",
    content_mr: "जेव्हा अनुष्का अन्नपूर्णा कोर्समध्ये सामील झाली, तेव्हा स्वयंपाक करणे हे तिच्यासाठी आधीपासूनच परिचयाचे कौशल्य होते. तिने यापूर्वी सहा वर्षे घरगुती अन्न व्यवसाय चालवला होता, परंतु कोविड-१९ महामारीच्या काळात हा व्यवसाय बंद करावा लागला. आपला व्यवसाय पुन्हा उभा करण्यासाठी तिला नवीन कौशल्यांची आणि आत्मविश्वासाची गरज वाटली. तीन महिन्यांच्या कोर्स दरम्यान तिने खाद्यपदार्थांचे स्टॉल्स आणि विविध प्रात्यक्षिक उपक्रमांमध्ये सहभाग घेतला, ज्यामुळे तिच्यातील उद्योजकता पुन्हा जागृत झाली. आज अनुष्का विविध घरगुती अन्नपदार्थांच्या ऑर्डर यशस्वीरित्या घेते आणि नियमितपणे खाद्यपदार्थांचे स्टॉल्स चालवते, स्वयंपाकाच्या आवडीतून ती पुन्हा एकदा भरभराटीची उपजीविका उभी करत आहे.",
    avatar: "AN"
  }
];

export const FAQS = [
  {
    q: "How can I enroll in a course?",
    a: "You can visit our Rajwada Campus office or fill out the inquiry form on our contact page. Our team will guide you through the process."
  },
  {
    q: "Are the certificates government-recognised?",
    a: "Yes, many of our vocational courses are recognised by relevant government bodies and skill development councils."
  },
  {
    q: "Can I donate to the trust?",
    a: "Absolutely! BNP is a registered public trust. You can contribute via bank transfer, cheque, or visit us for more details."
  },
  {
    q: "Is there a hostel facility for women?",
    a: "Yes, we provide safe and affordable hostel facilities for working women and students in Sangli."
  }
];

export const FUTURE_COURSES = [
  {
    name: "MPSC Foundation Training",
    note: "Coaching for state public service exams — launching soon.",
    icon: "BookOpen",
  },
  {
    name: "Spoken English & Soft Skills",
    note: "Confidence and communication for young professionals.",
    icon: "Languages",
  },
  {
    name: "Digital Marketing",
    note: "SEO, social media and content fundamentals.",
    icon: "Globe"
  },
];
