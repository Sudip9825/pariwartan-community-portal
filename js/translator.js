/**
 * Pariwantan Ka Lagi Aawaj - Language Translation Engine
 * Manages static and dynamic translations between English and Nepali.
 * Persists user preference via localStorage.
 */

(function () {
  // Dictionary containing translations for both static labels and default mock data.
  const staticDictionary = {
    // Nav & Brand
    logo_main: { np: "परिवर्तनका लागि आवाज", en: "Voice for Change" },
    logo_sub: { np: "Pariwantan Ka Lagi Aawaj", en: "Community Outlet" },
    nav_home: { np: "गृहपृष्ठ", en: "Home" },
    nav_news: { np: "समाचार", en: "News" },
    nav_gallery: { np: "तस्बिरहरू", en: "Gallery" },
    nav_creative: { np: "सिर्जना", en: "Creative Corner" },
    nav_about: { np: "हाम्रो बारेमा", en: "About" },
    nav_contact: { np: "सम्पर्क", en: "Contact" },

    // Home Page Section Headers
    section_news_title: { np: "ताजा समाचार", en: "Latest News" },
    section_news_link: { np: "थप समाचारहरू", en: "More News" },
    section_gallery_title: { np: "हाम्रो परिवेश", en: "Photo Gallery" },
    section_gallery_link: { np: "सबै तस्बिरहरू", en: "All Photos" },
    section_creative_title: { np: "साहित्यिक कुना", en: "Creative Corner" },
    section_creative_link: { np: "सबै रचनाहरू", en: "All Creations" },

    // Footer
    footer_desc: {
      np: "यो एक स्थानीय सञ्चार माध्यम हो, जसले समाजमा सकारात्मक परिवर्तनका लागि स्थानीय आवाज, संस्कृति, साहित्य र जनचासोका सवालहरूलाई उजागर गर्दछ।",
      en: "This is a local community media outlet that highlights local voices, culture, literature, and public interest issues for positive change in society."
    },
    footer_links_title: { np: "द्रुत लिङ्कहरू", en: "Quick Links" },
    footer_news_title: { np: "विधागत समाचार", en: "Categories" },
    footer_contact_title: { np: "सम्पर्क जानकारी", en: "Contact Info" },
    footer_contact_address: { np: "धुलिखेल नगरपालिका-४, काभ्रेपलाञ्चोक, नेपाल", en: "Dhulikhel Municipality-4, Kavrepalanchok, Nepal" },
    footer_admin_link: { np: "नियन्त्रण कक्ष (Admin Panel)", en: "Admin Panel" },
    footer_design: { np: "डिजाईन: स्थानीय युवा सञ्जाल", en: "Design: Local Youth Network" },
    footer_rights: { np: "परिवर्तनका लागि आवाज। सबै अधिकार सुरक्षित।", en: "Voice for Change. All Rights Reserved." },

    // Newsletter & Floating CTA
    cta_submit_creation: { np: "सिर्जना पठाउनुहोस्", en: "Submit Creation" },
    newsletter_title: { np: "सामुदायिक अभियानमा जोडिनुहोस्", en: "Join the Community Campaign" },
    newsletter_subtitle: {
      np: "स्थानीय समाचार, कविता, कथाहरू र गाउँका ताजा अपडेट सिधै आफ्नो मोबाइल वा इमेलमा पाउनको लागि साइन अप गर्नुहोस्।",
      en: "Sign up to receive local news, poems, stories, and fresh community updates directly to your mobile or email."
    },
    newsletter_placeholder: { np: "तपाईंको इमेल ठेगाना लेख्नुहोस्...", en: "Enter your email address..." },
    newsletter_subscribe: { np: "सदस्य बन्नुहोस्", en: "Subscribe" },

    // Global Modals (Submit Modal)
    modal_submit_title: { np: "सिर्जना / सामग्री पठाउनुहोस्", en: "Submit Creation / Content" },
    modal_label_name: { np: "पूरा नाम *", en: "Full Name *" },
    modal_placeholder_name: { np: "तपाईंको नाम लेख्नुहोस्", en: "Enter your full name" },
    modal_label_email: { np: "इमेल ठेगाना *", en: "Email Address *" },
    modal_placeholder_email: { np: "तपाईंको इमेल लेख्नुहोस्", en: "Enter your email address" },
    modal_label_type: { np: "सामग्रीको विधा *", en: "Content Type *" },
    modal_type_poem: { np: "कविता (Poem)", en: "Poem" },
    modal_type_story: { np: "कथा (Short Story)", en: "Short Story" },
    modal_type_novel: { np: "उपन्यासको अंश (Novel Chapter)", en: "Novel Chapter" },
    modal_type_photo: { np: "स्थानीय फोटो (Photo)", en: "Photo Submission" },
    modal_type_news: { np: "स्थानीय समाचार (News Tip)", en: "Local News Tip" },
    modal_label_title: { np: "शीर्षक *", en: "Title *" },
    modal_placeholder_title: { np: "सामग्रीको शीर्षक", en: "Title of your content" },
    modal_label_body: { np: "सामग्रीको विवरण वा पाठ *", en: "Content Body / Description *" },
    modal_placeholder_body: { np: "तपाईंको कविता, कथा वा समाचारको मुख्य पाठ यहाँ लेख्नुहोस्...", en: "Write your poem, story, or news text here..." },
    modal_btn_submit: { np: "सामग्री बुझाउनुहोस्", en: "Submit Content" },

    // Global Search Drawer
    search_placeholder: { np: "समाचार, कथा वा कविता खोज्नुहोस्...", en: "Search news, stories, or poems..." },
    search_prompt: { np: "केही टाइप गरी खोज्नुहोस्...", en: "Type something to search..." },

    // News Page & Dynamic Elements
    cat_all: { np: "सबै", en: "All" },
    cat_local: { np: "स्थानीय", en: "Local" },
    cat_society: { np: "समाज", en: "Society" },
    cat_culture: { np: "संस्कृति", en: "Culture" },
    cat_environment: { np: "वातावरण", en: "Environment" },
    cat_politics: { np: "राजनीति", en: "Politics" },
    
    news_search_placeholder: { np: "समाचार खोज्नुहोस्...", en: "Search news..." },
    news_empty: { np: "खोजिएको विधा वा कुञ्जी शब्दमा कुनै समाचार भेटिएन।", en: "No news found in the selected category or search term." },
    news_related_title: { np: "सम्बन्धित समाचार", en: "Related News" },
    news_back_btn: { np: "समाचार सूचीमा फर्कनुहोस्", en: "Back to News List" },
    news_read_more: { np: "थप पढ्नुहोस्", en: "Read More" },

    // Gallery Page
    cat_places: { np: "स्थानहरू", en: "Places" },
    cat_events: { np: "कार्यक्रमहरू", en: "Events" },
    cat_people: { np: "मानिसहरू", en: "People" },
    gallery_empty: { np: "यस विधामा कुनै तस्बिरहरू उपलब्ध छैनन्।", en: "No images available in this category." },
    gallery_lightbox_close: { np: "बन्द गर्नुहोस्", en: "Close" },

    // Creative Page
    tab_story: { np: "कथा", en: "Stories" },
    tab_poem: { np: "कविता", en: "Poems" },
    tab_novel: { np: "उपन्यास", en: "Novels" },
    creative_empty: { np: "यस विधामा कुनै रचनाहरू उपलब्ध छैनन्।", en: "No works available in this category." },
    creative_back_btn: { np: "साहित्य सूचीमा फर्कनुहोस्", en: "Back to Literary List" },
    creative_read_full: { np: "पूरा पढ्नुहोस्", en: "Read Full" },
    creative_read_story: { np: "कथा पढ्नुहोस्", en: "Read Story" },
    creative_read_poem: { np: "कविता पढ्नुहोस्", en: "Read Poem" },
    creative_author_prefix: { np: "लेखक:", en: "Author:" },
    creative_poet_prefix: { np: "कवि:", en: "Poet:" },
    
    reader_font_size: { np: "अक्षर आकार (Font Size)", en: "Font Size" },
    reader_font_type: { np: "फन्ट प्रकार (Font Type)", en: "Font Style" },
    reader_font_serif: { np: "Serif फन्ट", en: "Serif" },
    reader_font_sans: { np: "Sans-serif फन्ट", en: "Sans" },
    
    reader_chapter_prev: { np: "अघिल्लो अध्याय", en: "Previous Chapter" },
    reader_chapter_next: { np: "अर्को अध्याय", en: "Next Chapter" },
    
    like_btn_text: { np: "मनपराउनुहोस् (Like)", en: "Like" },
    comments_section_title: { np: "प्रतिक्रियाहरू", en: "Comments" },
    comments_empty: { np: "कुनै प्रतिक्रिया छैन। पहिलो प्रतिक्रिया लेख्नुहोस्!", en: "No comments yet. Write the first comment!" },
    comment_form_title: { np: "प्रतिक्रिया दिनुहोस् (Leave a Comment)", en: "Leave a Comment" },
    comment_label_name: { np: "तपाईंको नाम *", en: "Your Name *" },
    comment_label_text: { np: "तपाईंको प्रतिक्रिया *", en: "Your Comment *" },
    comment_placeholder_text: { np: "तपाईंको प्रतिक्रिया यहाँ लेख्नुहोस्...", en: "Write your comment here..." },
    comment_btn_submit: { np: "प्रतिक्रिया बुझाउनुहोस्", en: "Submit Comment" },

    // About Page
    about_hero_title: { np: "हाम्रो बारेमा (About Us)", en: "About Us" },
    about_hero_subtitle: {
      np: `"स्थानीय आवाज, सामुदायिक एकता र सामाजिक रूपान्तरणको संवाहक"`,
      en: `"Voice of local issues, catalyst for community unity and social transformation"`
    },
    about_mission_title: { np: "हाम्रो उद्देश्य (Our Mission)", en: "Our Mission" },
    about_mission_p1: {
      np: `<strong>"परिवर्तनका लागि आवाज"</strong> (Pariwantan Ka Lagi Aawaj) एक गैर-नाफामूलक सामुदायिक सञ्चार संस्था हो। स्थानीय स्तरमा भइरहेका महत्वपूर्ण गतिविधि, जनचासोका सवालहरू र ओझेलमा परेका सामुदायिक मुद्दाहरूलाई उजागर गर्दै समाजमा सकारात्मक परिवर्तन ल्याउनु नै हाम्रो मुख्य ध्येय हो।`,
      en: `<strong>"Voice for Change"</strong> (Pariwantan Ka Lagi Aawaj) is a non-profit community media outlet. Our primary mission is to bring positive social changes by highlighting critical local happenings, public interests, and overshadowed issues.`
    },
    about_mission_p2: {
      np: `हामी केवल एक समाचार पोर्टल मात्र होइनौँ। हामी स्थानीय प्रतिभा, लेखक, र सर्जकहरूलाई आफ्ना रचना (कथा, कविता, र विचारहरू) प्रस्तुत गर्ने एउटा खुला मञ्च भी प्रदान गर्दछौँ। यसका साथै, स्थानीय ऐतिहासिक सम्पदा, प्राकृतिक सौन्दर्य र विविध सांस्कृतिक पाटोहरूलाई तस्बिर मार्फत कैद गरी विश्वमाझ चिनाउन हामी सधैँ क्रियाशील छौँ।`,
      en: `We are not just a news portal. We provide a platform for local creators, poets, and storytellers to express their literary contributions. We are also committed to capturing local heritage, scenic landscapes, and cultural festivities through photography to showcase them globally.`
    },
    about_mission_p3: {
      np: `हामी विश्वास गर्छौँ कि एउटा सबल र सुसूचित समाज निर्माणका लागि स्थानीय मानिसहरूको प्रत्यक्ष संलग्नता र आवाजको कदर हुनुपर्छ। त्यसैले, हामी स्थानीय वासिन्दाहरूलाई नै आफ्ना कथाहरू, समाचार र तस्बिरहरू सिधै हाम्रो वेबसाइट मार्फत हामीसँग साझा गर्न आमन्त्रित गर्दछौँ।`,
      en: `We believe that direct public involvement and valuing citizen voices are core pillars of a well-informed society. Therefore, we invite local citizens to share their stories, news, and photographs with us directly through this platform.`
    },
    about_stat_1_num: { np: "२०+", en: "20+" },
    about_stat_1_lbl: { np: "स्थानीय संवाददाताहरू", en: "Local Reporters" },
    about_stat_2_num: { np: "५००+", en: "500+" },
    about_stat_2_lbl: { np: "साहित्यिक रचनाहरू", en: "Literary Works" },
    about_stat_3_num: { np: "१०,०००+", en: "10,000+" },
    about_stat_3_lbl: { np: "मासिक पाठकहरू", en: "Monthly Readers" },
    about_team_title: { np: "हाम्रो टोली (Meet The Team)", en: "Meet The Team" },
    about_team_1_role: { np: "प्रधान सम्पादक / संयोजक", en: "Editor-in-Chief / Coordinator" },
    about_team_2_role: { np: "कला र साहित्य सम्पादक", en: "Art & Literature Editor" },
    about_team_3_role: { np: "वरिष्ठ संवाददाता (समाज र वातावरण)", en: "Senior Correspondent (Society & Env)" },
    about_team_4_role: { np: "मल्टिमिडिया र फोटो पत्रकार", en: "Multimedia & Photo Journalist" },

    // Contact Page
    contact_title: { np: "हामीलाई सम्पर्क गर्नुहोस् (Contact Us)", en: "Contact Us" },
    contact_info_title: { np: "सम्पर्क विवरणहरू", en: "Contact Details" },
    contact_info_desc: {
      np: "हाम्रो सञ्चार माध्यम वा साहित्यिक कुनामा कुनै जिज्ञासा, सुझाव वा प्रतिक्रिया भएमा निम्न माध्यमबाट सिधै सम्पर्क गर्न सक्नुहुन्छ।",
      en: "For inquiries, suggestions, or comments regarding our platform or literary corner, feel free to reach out to us."
    },
    contact_office_title: { np: "मुख्य कार्यालय", en: "Head Office" },
    contact_office_desc: { np: "धुलिखेल नगरपालिका-४, काभ्रेपलाञ्चोक, बागमती प्रदेश, नेपाल", en: "Dhulikhel Municipality-4, Kavrepalanchok, Bagmati, Nepal" },
    contact_phone_title: { np: "फोन नम्बरहरू", en: "Phone Numbers" },
    contact_phone_desc: { np: "+९७७-११-४९०१२३ (कार्यालय), ९८५१२३४५६७", en: "+977-11-490123 (Office), 9851234567" },
    contact_email_title: { np: "इमेल ठेगाना", en: "Email Address" },
    contact_email_desc: { np: "info@pariwantanaawaj.org.np (सामान्य), editor@pariwantanaawaj.org.np (सम्पादकीय)", en: "info@pariwantanaawaj.org.np (General), editor@pariwantanaawaj.org.np (Editorial)" },
    
    contact_form_title: { np: "सन्देश पठाउनुहोस् (Send Message)", en: "Send Message" },
    contact_form_label_name: { np: "नाम (Your Name) *", en: "Your Name *" },
    contact_form_placeholder_name: { np: "तपाईंको पूरा नाम लेख्नुहोस्", en: "Enter your full name" },
    contact_form_label_email: { np: "इमेल (Email Address) *", en: "Email Address *" },
    contact_form_placeholder_email: { np: "तपाईंको इमेल ठेगाना", en: "Enter your email address" },
    contact_form_label_subject: { np: "विषय (Subject) *", en: "Subject *" },
    contact_form_placeholder_subject: { np: "कुन सन्दर्भमा हो?", en: "What is the subject?" },
    contact_form_label_msg: { np: "सन्देश वा जिज्ञासा (Message) *", en: "Message *" },
    contact_form_placeholder_msg: { np: "तपाईंको सन्देश यहाँ लेख्नुहोस्...", en: "Write your message here..." },
    contact_form_btn: { np: "सन्देश पठाउनुहोस्", en: "Send Message" },
    
    contact_cta_title: { np: "तपाईंको साहित्यिक सिर्जना वा तस्बिर छ?", en: "Do you have a literary piece or photo?" },
    contact_cta_desc: {
      np: "हाम्रो साहित्यिक कुनामा रचना वा तस्बिर छाप्नको लागि सिधै सामग्री बुझाउनुहोस्।",
      en: "Submit your articles, stories, poems, or photographs to be published in our community corners."
    },
    contact_cta_btn: { np: "सिर्जना बुझाउनुहोस्", en: "Submit Creation" }
  };

  // Database mock translation dictionary (English keys translate to Nepali values under 'np')
  // And Nepali keys translate to English values under 'en'.
  const dataDictionary = {
    np: {
      // News Titles
      "Kathmandu Valley's Ancient Stone Spouts Revived by Local Youth Networks": "काठमाडौँ उपत्यकाका प्राचीन ढुङ्गेधाराहरू स्थानीय युवा सञ्जालद्वारा पुनर्जीवित",
      "Community Forest Initiative in Dhulikhel Sets New Model for Biodiversity Conservation": "धुलिखेलको सामुदायिक वन अभियानद्वारा जैविक विविधता संरक्षणमा नयाँ मोडेल प्रस्तुत",
      "Panchkhal Farmers Embrace Organic Polyhouse Farming to Combat Drought": "पञ्चखालका किसानद्वारा खडेरीविरुद्ध लड्न अर्गानिक पोलिहाउस खेती अवलम्बन",
      "Sankhu Hosts Historic Cultural Jatra with Joy and Renewed Youth Participation": "साँखुमा ऐतिहासिक सांस्कृतिक जात्रा हर्षोल्लास र युवाको उत्साहजनक सहभागिताका साथ सम्पन्न",
      "Siddharthanagar Municipality Debates Master Plan for Sustainable Waste Management": "सिद्धार्थनगर नगरपालिकामा दिगो फोहोर व्यवस्थापनको गुरुयोजनामाथि बहस",

      // Excerpts
      "In a remarkable display of civic responsibility, groups of young volunteers have successfully restored water flow in three historic stone spouts (Hitis) in Patan, blending traditional knowledge with modern engineering.": "नागरिक दायित्वको एउटा उत्कृष्ट उदाहरण प्रस्तुत गर्दै युवा स्वयंसेवकहरूको समूहले परम्परागत ज्ञान र आधुनिक इन्जिनियरिङको मिश्रण गरी पाटनका तीन ऐतिहासिक ढुङ्गेधारा (हिति) मा पानी फर्काउन सफल भएका छन्।",
      "Through systematic tree planting and strict ban on illegal logging, the community forest users' group of Dhulikhel has successfully welcomed back several rare bird species and leopard populations.": "व्यवस्थित वृक्षारोपण र अवैध फँडानीमाथि कडा प्रतिबन्ध लगाएर धुलिखेलको सामुदायिक वन उपभोक्ता समूहले धेरै दुर्लभ चरा र चितुवाको संख्यालाई सफलतापूर्वक वनमा फिर्ता स्वागत गरेको छ।",
      "Facing unpredictable monsoon seasons and depleting groundwater, farmers in Panchkhal are turning to greenhouse polyhouse technology, doubling yields and reducing water consumption by 60%.": "अस्थिर मनसुन र घट्दो भूमिगत पानीको समस्या भोग्दै पञ्चखालका किसानहरू हरितगृह पोलिहाउस प्रविधिको प्रयोगतर्फ आकर्षित भएका छन्, जसले उत्पादन दोब्बर बनाएको छ र पानीको खपत ६०% ले घटाएको छ।",
      "The historic town of Sankhu witnessed a colorful chariot festival this week, marked by a massive turnout of young residents carrying on age-old religious and social traditions.": "साँखुको ऐतिहासिक सहरले यस हप्ता एउटा भव्य रथयात्रा उत्सव प्रत्यक्ष देख्यो, जसमा वर्षौँ पुराना धार्मिक र सामाजिक परम्पराहरूलाई निरन्तरता दिँदै स्थानीय युवाहरूको ठूलो सहभागिता थियो।",
      "The municipal council meeting ended with a consensus to partner with local private recycling agencies, introducing mandatory household segregation of organic and inorganic waste.": "नगर कार्यपालिकाको बैठकले स्थानीय निजी पुन:प्रशोधन एजेन्सीहरूसँग साझेदारी गर्दै घरमै जैविक र अजैविक फोहोर अनिवार्य रूपमा वर्गीकरण गर्ने व्यवस्था लागु गर्ने सहमति जनाएको छ।",

      // Content (News Articles HTML bodies)
      // Article 1
      "<p><strong>LALITPUR</strong> — For over a decade, the historic Alko Hiti in Patan remained dry, its stone carvings gathering dust and its channels blocked by rapid urbanization. Today, cool, clean water flows steadily from the beautifully carved crocodile spouts, thanks to a citizen-led initiative spearheaded by local youths.</p>":
        "<p><strong>ललितपुर</strong> — विगत एक दशकभन्दा लामो समयदेखि पाटनको ऐतिहासिक अलको हिति सुख्खा थियो। तीव्र सहरीकरणका कारण यसका ढुङ्गे बुट्टाहरू धुलोले भरिएका र च्यानलहरू बन्द थिए। आज, स्थानीय युवाहरूको नेतृत्वमा नागरिक अभियानको पहलमा यसका कलात्मक गोही आकारका ढुङ्गेधाराबाट चिसो र सफा पानी निरन्तर बगिरहेको छ।</p>",
      "The restoration project, titled \"Hamro Hiti, Hamro Sahas\" (Our Spouts, Our Courage), began six months ago as a small community clean-up drive. It quickly grew into a heritage preservation campaign, drawing volunteers, traditional water experts (Rajkulas), and municipal engineers.":
        "\"हाम्रो हिति, हाम्रो साहस\" नामक यो पुनरुत्थान परियोजना ६ महिनाअघि एक सानो सामुदायिक सरसफाई अभियानको रूपमा सुरु भएको थियो। यो छिट्टै सम्पदा संरक्षण अभियानमा परिणत भयो, जसमा स्वयंसेवक, परम्परागत पानीविज्ञ (राजकुलो सम्बन्धी जानकार) र नगरपालिकाका इन्जिनियरहरू जोडिए।",
      "\"These hitis are not just sources of water; they are structural marvels and the lifeblood of our historic neighborhoods. Reclaiming them is reclaiming our community's identity,\" said 24-year-old Prerna Shrestha, one of the lead coordinators.":
        "\"यी हितिहरू केवल पानीका स्रोत मात्र होइनन्; यी त ऐतिहासिक कलाका आश्चर्य र हाम्रा ऐतिहासिक टोलका प्राण हुन्। यिनलाई ब्युँताउनु भनेको हाम्रो समुदायको पहिचान ब्युँताउनु हो,\" प्रमुख संयोजक मध्येकी २४ वर्षीया प्रेरणा श्रेष्ठले भनिन्।",
      "The team mapped the underground channels (known as Rajkulas or royal canals) that transport water from surrounding hills. Over years of road constructions, several segments of these channels had been damaged or covered. With help from elders who remembered the channel paths, the volunteers excavated blocked points, cleared debris, and routed the flow away from sewage networks.":
        "यस टोलीले वरपरका पहाडबाट पानी ल्याउने भूमिगत च्यानल (राजकुलो) को नक्साङ्कन गर्यो। वर्षौँदेखिको सडक निर्माणका कारण यी राजकुलोका धेरै खण्डहरू भत्किएका वा पुरिएका थिए। पुराना च्यानलका बाटोहरू सम्झने ज्येष्ठ नागरिकहरूको सहयोगमा स्वयंसेवकहरूले थुनिएका ठाउँहरू खने, फोहोर हटाए र ढलको पानी मिसिनबाट जोगाएर पानीलाई हितितर्फ सोझ्याए।",
      "<h3>A Blend of Tradition and Engineering</h3>": "<h3>परम्परा र इन्जिनियरिङको अद्भुत मिश्रण</h3>",
      "One of the key challenges was maintaining the traditional terracotta piping system while ensuring durability. Traditional stone spout repair requires specialized knowledge of sand-and-charcoal filtration layers, which naturally purify the water before it reaches the spouts. The youth team collaborated with elderly masons to ensure that the heritage aesthetics and ecological techniques were strictly followed.":
        "स्थायित्व सुनिश्चित गर्दै परम्परागत माटोको पाइप प्रणालीलाई जोगाउनु एउटा मुख्य चुनौती थियो। परम्परागत ढुङ्गेधारा मर्मतका लागि बालुवा र कोइलाको प्राकृतिक फिल्टर तह सम्बन्धी विशेष ज्ञान चाहिन्छ, जसले धारामा पुग्नुअघि नै पानीलाई प्राकृतिक रूपमा शुद्ध बनाउँछ। युवा टोलीले सम्पदाको सौन्दर्य र वातावरणीय प्रविधि कडाइका साथ पालना गर्न पाका कालीगढहरूसँग सहकार्य गरे।",
      "Water quality tests conducted last week showed that the water is completely safe for domestic use and contains high minerals, typical of historic Kathmandu valley springs. The local ward office has now pledged a budget of NPR 500,000 for the ongoing maintenance of the site and to install solar-powered lighting around the public courtyard.":
        "गत हप्ता गरिएको पानी परीक्षणले यो पानी घरायसी प्रयोजनका लागि पूर्ण सुरक्षित रहेको र काठमाडौँ उपत्यकाका ऐतिहासिक मुहान जस्तै खनिज तत्वले भरिपूर्ण रहेको देखायो। स्थानीय वडा कार्यालयले यस क्षेत्रको निरन्तर मर्मत सम्भार र सार्वजनिक आँगन वरपर सौर्य बत्ती जडान गर्न रु. ५,००,००० बजेट विनियोजन गर्ने प्रतिबद्धता जनाएको छ।",
      "This success has sparked similar movements in Bhaktapur and Kathmandu districts, proving that community voice and local action can solve infrastructure and heritage preservation challenges simultaneously.":
        "यो सफलताले भक्तपुर र काठमाडौँ जिल्लामा पनि यस्तै अभियानहरू सुरु गर्न प्रोत्साहन मिलेको छ र सावित गरेको छ कि सामुदायिक सहभागिता र स्थानीय सक्रियताले पूर्वाधार विकास र सम्पदा संरक्षणका चुनौतीहरूलाई एकसाथ समाधान गर्न सक्छ।",

      // Article 2
      "<p><strong>DHULIKHEL</strong> — The hills of Dhulikhel are green again, singing with the voices of birds that hadn't been seen in the region for decades. The local Community Forest User Group (CFUG) is celebrating a major milestone as a recent biodiversity survey recorded 45 new bird species and documented stable habitats for the endangered barking deer.</p>":
        "<p><strong>धुलिखेल</strong> — धुलिखेलका डाँडाहरू फेरि हरियाली भएका छन् र दशकौँदेखि नदेखिएका चराचुरुङ्गीहरूको मधुर स्वरले गुन्जिरहेका छन्। हालै गरिएको जैविक विविधता सर्वेक्षणमा ४५ नयाँ प्रजातिका चराचुरुङ्गी भेटिएको र दुर्लभ रतुवा मृगको स्थिर बासस्थान भेटिएपछि यहाँको सामुदायिक वन उपभोक्ता समूहले एउटा ठूलो कोसेढुङ्गा पार गरेको खुसीयाली मनाइरहेको छ।</p>",
      "Twenty years ago, these slopes were heavily degraded due to unchecked grazing and timber extraction. The transformation began when the forest management was completely handed over to local women-led committees.":
        "२० वर्षअघि अनियन्त्रित चरन र काठ काट्ने कार्यले यी भिरालो जमिनहरू उजाड बनेका थिए। वन व्यवस्थापनको सम्पूर्ण जिम्मा स्थानीय महिला नेतृत्वका समितिहरूलाई हस्तान्तरण गरिएपछि यहाँ रूपान्तरण सुरु भएको हो।",
      "\"We realized that if we didn't protect the forest, our water sources would dry up and our fields would suffer. The forest is our mother,\" says Goma Devi, chairperson of the committee.":
        "\"हामीले बुझ्यौँ कि यदि वन जोगाएनौँ भने हाम्रा पानीका मुहान सुक्नेछन् र खेतबारी बाँझै रहनेछन्। वन त हाम्रो आमा हो,\" समितिकी अध्यक्ष गोमा देवी भन्छिन्।",
      "The group established a system of rotational grazing, planted thousands of indigenous saplings (such as Uttis and Chilaune), and created artificial water ponds to support wildlife. They also hired local youth forest guards who conduct regular patrols, using mobile apps to report illegal logging or forest fires.":
        "समूहले आलोपालो चरिचरन प्रणाली स्थापना गर्यो, हजारौँ स्थानीय प्रजातिका बिरुवाहरू (जस्तै उत्तिस र चिलाउने) रोप्यो र वन्यजन्तुका लागि कृत्रिम पोखरीहरू बनायो। उनीहरूले स्थानीय युवा वन रक्षकहरू नियुक्त गरेका छन् जसले नियमित गस्ती गर्छन् र अवैध कटान वा डढेलोको रिपोर्ट मोबाइल एप मार्फत पठाउँछन्।",
      "Today, the Dhulikhel model is being studied by environmental researchers nationwide. It proves that decentralized, community-rooted management is the most effective shield against climate change and environmental degradation.":
        "आज, धुलिखेल मोडेल देशभरिका वातावरणीय अनुसन्धानकर्ताहरूद्वारा अध्ययन भइरहेको छ। यसले प्रमाणित गर्छ कि विकेन्द्रीकृत, समुदायमा आधारित व्यवस्थापन नै जलवायु परिवर्तन र वातावरणीय ह्रास विरुद्धको सबैभन्दा प्रभावकारी कवच हो।",

      // Article 3
      "<p><strong>PANCHKHAL</strong> — Panchkhal, known as the vegetable basket of Kavrepalanchok district, is undergoing an agricultural revolution. Faced with rising temperatures and severe water shortages, local farmers are discarding traditional open-field farming in favor of modern, high-tech polyhouses.</p>":
        "<p><strong>पञ्चखाल</strong> — काभ्रेपलाञ्चोक जिल्लाको तरकारीको टोकरी भनिने पञ्चखालमा एउटा कृषि क्रान्ति भइरहेको छ। बढ्दो तापक्रम र गम्भीर पानी अभावको सामना गर्दै स्थानीय किसानहरू परम्परागत खुला खेती त्यागेर आधुनिक, प्रविधियुक्त पोलिहाउस खेतीतर्फ आकर्षित भइरहेका छन्।</p>",
      "Polyhouses—tunnel structures covered with translucent plastic—protect crops from extreme heat, hail, pests, and heavy monsoon rains. When combined with drip irrigation systems, they use a fraction of the water required by traditional flooding methods.":
        "पारदर्शी प्लास्टिकले ढाकिएका सुरुङ जस्ता संरचना (पोलिहाउस) ले बालीलाई अत्यधिक गर्मी, असिना, कीरा र भारी मनसुनी वर्षाबाट बचाउँछ। थोपा सिँचाइ प्रणालीसँग मिलाउँदा यसले परम्परागत कुलो सिँचाइ विधिको तुलनामा निकै कम पानी खपत गर्छ।",
      "\"I used to struggle to grow enough tomatoes to cover my costs,\" says Ram Bahadur Lama, a local farmer. \"With my new polyhouse, I grow organic tomatoes all year round. The price of organic produce is higher, and I save on pesticides because the polyhouse keeps the pests out naturally.\"":
        "\"पहिले मलाई लगानी उठाउन पनि गोलभेडा उत्पादन गर्न धौ-धौ हुन्थ्यो,\" स्थानीय किसान रामबहादुर तामाङ भन्छन्। \"अहिले मेरो नयाँ पोलिहाउसमा म वर्षभरी अर्गानिक गोलभेडा फलाउँछु। अर्गानिक उत्पादनको मूल्य बढी छ र पोलिहाउसले प्राकृतिक रूपमा कीराहरू रोक्ने भएकाले मेरो विषादीको खर्च जोगिएको छ।\"",
      "The transition is supported by a local cooperative that provides low-interest loans and technical training on organic compost preparation. The cooperative has also established direct market links to organic outlets in Kathmandu, ensuring that farmers get a fair price without middlemen squeezing their profits.":
        "यो संक्रमणलाई एक स्थानीय सहकारीले सहयोग गरिरहेको छ जसले सस्तो ब्याजमा ऋण र अर्गानिक कम्पोष्ट मल बनाउने प्राविधिक तालिम प्रदान गर्दछ। सहकारीले काठमाडौँका अर्गानिक पसलहरूसँग सिधा बजार सम्बन्ध स्थापित गरेको छ, जसले बिचौलिया बिना किसानहरूले आफ्नो उत्पादनको उचित मूल्य पाउने सुनिश्चित गर्दछ।",

      // Article 4
      "<p><strong>SANKHU</strong> — The narrow brick-paved streets of the historic town of Sankhu echoed with the thunderous beats of Dhimay drums and the clashing of cymbals as the annual chariot festival (Jatra) took place with vibrant energy.</p>":
        "<p><strong>साँखु</strong> — ऐतिहासिक साँखु सहरका साँघुरा इँटा छापिएका गल्लीहरू धीमे बाजाको गर्जन र झ्याम्टाको आवाजले गुञ्जिरहेका थिए र वार्षिक रथजात्रा अत्यन्तै उत्साहका साथ सम्पन्न भएको छ।</p>",
      "This year, the highlight was the dominant presence of young men and women. Traditionally, organizing the Jatra and carrying the heavy wooden chariots was the duty of village elders. However, concerned that the custom might fade away, local youth clubs organized training sessions on playing traditional instruments and coordinating chariot movements.":
        "यस वर्षको आकर्षण मुख्य रूपमा युवा युवतीहरूको सक्रिय सहभागिता थियो। परम्परागत रूपमा रथजात्राको व्यवस्थापन गर्ने र गह्रौँ काठका रथहरू तान्ने काम गाउँका पाका व्यक्तिहरूको हुन्थ्यो। तर, यो संस्कृति लोप हुन सक्छ भन्ने चिन्ता गर्दै स्थानीय युवा क्लबहरूले परम्परागत बाजा बजाउने र रथ तान्ने तालिम सत्रहरू आयोजना गरे।",
      "\"Our culture is our soul. If we, the youth, don't carry the chariots today, who will do it tomorrow? It's our privilege to bear this weight,\" says 21-year-old Niraj Shrestha, who was leading a team of drum players.":
        "\"हाम्रो संस्कृति हाम्रो आत्मा हो। यदि हामी युवाहरूले आज रथ बोकेनौँ भने भोलि कसले बोक्छ? यो भारी बोक्न पाउनु हाम्रो अहोभाग्य हो,\" बाजा बजाउने टोलीको नेतृत्व गरिरहेका २१ वर्षीय नीरज श्रेष्ठ भन्छन्।",
      "The festival brought together thousands of visitors from Kathmandu and neighboring districts, boosting local businesses and fostering community solidarity in the post-earthquake reconstructed settlement.</p>":
        "जात्राले काठमाडौँ र वरपरका जिल्लाबाट हजारौँ दर्शकहरूलाई आकर्षित गर्यो, जसले स्थानीय व्यापारलाई टेवा पुर्यायो र भूकम्पपछि पुनर्निर्माण गरिएको बस्तीमा सामुदायिक सद्भाव बलियो बनायो।",

      // Article 5
      "<p><strong>SIDDHARTHANAGAR</strong> — Siddharthanagar Municipality is set to implement a sweeping new waste management policy that could serve as a template for other rapidly growing towns in the Tarai plains.</p>":
        "<p><strong>सिद्धार्थनगर</strong> — सिद्धार्थनगर नगरपालिकाले फोहोर व्यवस्थापनको एउटा नयाँ र व्यापक नीति लागू गर्न गइरहेको छ, जसले तराईका अन्य तीव्र गतिमा बढिरहेका सहरहरूका लागि मार्गचित्रको काम गर्न सक्छ।</p>",
      "Following intense public debates and consultations with environment experts, the municipal council approved the \"Zero Waste Initiative.\" Starting next month, households will be required to segregate waste into dry (recyclable) and wet (biodegradable) categories before disposal.":
        "तीव्र सार्वजनिक बहस र वातावरणविद्हरूसँगको परामर्शपछि नगर परिषद्ले \"शून्य फोहोर अभियान\" स्वीकृत गरेको छ। आगामी महिनादेखि घरधुरीहरूले फोहोर फाल्नुअघि सुक्खा (पुन:प्रशोधन योग्य) र भिजेको (सड्ने) वर्गमा छुट्ट्याउनुपर्नेछ।",
      "The municipality will distribute colored bins to homes and run public awareness campaigns in schools. The wet waste will be processed at a new community composting plant, while dry waste will be sold to recycling businesses, turning waste management into a self-sustaining revenue-generating model.":
        "नगरपालिकाले घरघरमा रङ्गीन डस्टबिन वितरण गर्नेछ र विद्यालयहरूमा जनचेतना जगाउनेछ। कुहिने फोहोरलाई नयाँ सामुदायिक कम्पोष्टिङ प्लान्टमा प्रशोधन गरिनेछ भने सुक्खा फोहोरलाई पुन:प्रशोधन गर्ने उद्योगहरूलाई बेचेर फोहोर व्यवस्थापनलाई आम्दानी गर्ने आत्मनिर्भर मोडल बनाइनेछ।",

      // Dynamic Categories & Meta text
      "Local": "स्थानीय",
      "Society": "समाज",
      "Culture": "संस्कृति",
      "Environment": "वातावरण",
      "Politics": "राजनीति",
      "Places": "स्थानहरू",
      "Events": "कार्यक्रमहरू",
      "People": "मानिसहरू",
      "Poem": "कविता",
      "Story": "कथा",
      "Novel": "उपन्यास",
      "Read Time": "पढ्ने समय",
      "4 Min Read": "४ मिनेट पढाइ",
      "3 Min Read": "३ मिनेट पढाइ",
      "5 Min Read": "५ मिनेट पढाइ",
      "2 Min Read": "२ मिनेट पढाइ",
      "12 Min Read (Total)": "१२ मिनेट पढाइ (जम्मा)",
      
      // Authors
      "Prashant Dahal": "प्रशान्त दाहाल",
      "Sujata Baral": "सुजाता बराल",
      "Hari Prasad Rimal": "हरिप्रसाद रिमाल",
      "Manish Tamang": "मनिष तामाङ",
      "Pooja Acharya": "पूजा आचार्य",
      "Ramesh Adhikari": "रमेश अधिकारी",
      "Shraddha Thapa": "श्रद्धा थापा",
      "Birat Shrestha": "विराट श्रेष्ठ",
      "Prerna Shrestha": "प्रेरणा श्रेष्ठ",

      // Gallery titles and captions
      "Rara Lake Morning Calm": "रारा तालको शान्त बिहानी",
      "The pristine blue water of Rara Lake, Mugu, reflecting the early morning sun and pine forests.": "मुगुको रारा तालको कञ्चन नीलो पानीमा प्रतिबिम्बित बिहानीको घाम र सल्लाको वन।",
      "Patan Durbar Heritage Square": "पाटन दरबार क्षेत्र",
      "Meticulous brickwork and wooden carvings of the Krishna Mandir in Patan, a UNESCO World Heritage site.": "युनेस्को विश्व सम्पदा सूचीमा सूचीकृत पाटनको कृष्ण मन्दिरको कलात्मक इँटा र काठको बुट्टा।",
      "Indra Jatra Celebrations": "इन्द्रजात्रा उत्सव",
      "Devotees pulling the sacred chariot of Kumari, the living goddess, during Indra Jatra in Basantapur, Kathmandu.": "काठमाडौँको वसन्तपुरमा इन्द्रजात्राका अवसरमा जीवित देवी कुमारीको रथ तान्दै भक्तजनहरू।",
      "Terrace Farming in Kirtipur": "कीर्तिपुरमा गरा खेती",
      "A local farmer tending to mustard fields in the terraced outskirts of Kirtipur during the golden hour.": "कीर्तिपुरको काँठ क्षेत्रमा गोधुली समयमा तोरी बारी गोडमेल गर्दै एक स्थानीय किसान।",
      "Fishtail Mountain from Pokhara": "पोखराबाट माछापुच्छ्रे हिमाल",
      "The iconic double peak of Machhapuchhre (Fishtail) rising above Pokhara Valley, kissed by morning sunlight.": "बिहानीको झुल्के घामले चुमेको पोखरा उपत्यका माथि ठिंग उभिएको माछापुच्छ्रे हिमालको दुईवटा चुचुरो।",
      "Traditional Newari Feast Preparation": "परम्परागत नेवारी भोजको तयारी",
      "Preparation of traditional 'Samay Baji' dishes, symbolizing prosperity and community harmony.": "समृद्धि र सामुदायिक सद्भावको प्रतीक परम्परागत 'समय बजी' भोजको तयारी।",

      // Comments from database
      "Suresh Thapa": "सुरेश थापा",
      "निकै मार्मिक कथा! हाम्रो गाउँघरका चौतारीहरू साँच्चै नै हाम्रा सम्पदा हुन्, तिनको संरक्षण गर्नुपर्छ।": "निकै मार्मिक कथा! हाम्रो गाउँघरका चौतारीहरू साँच्चै नै हाम्रा सम्पदा हुन्, तिनको संरक्षण गर्नुपर्छ।",
      "Mina Shrestha": "मिना श्रेष्ठ",
      "हरि बुबाको कथाले मेरो आफ्नै हजुरबुबाको याद दिलायो। सुन्दर प्रस्तुति!": "हरि बुबाको कथाले मेरो आफ्नै हजुरबुबाको याद दिलायो। सुन्दर प्रस्तुति!",
      "Dipendra Oli": "दिपेन्द्र ओली",
      "ओझिलो कविता! हरेक नेपालीको मन छुने शब्दहरू।": "ओझिलो कविता! हरेक नेपालीको मन छुने शब्दहरू।",
      "Sanjana KC": "सञ्जना केसी",
      "परिवर्तनका लागि आवाजको नारा कवितामा निकै राम्रोसँग प्रस्तुत गरिएको छ।": "परिवर्तनका लागि आवाजको नारा कवितामा निकै राम्रोसँग प्रस्तुत गरिएको छ।",
      "Kiran Roka": "किरण रोक्का",
      "सोलुको जनजीवनको जीवन्त चित्रण! अध्याय ३ को तीव्र पर्खाइमा छु।": "सोलुको जनजीवनको जीवन्त चित्रण! अध्याय ३ को तीव्र पर्खाइमा छु।",
      "Dawa Sherpa": "दावा शेर्पा",
      "हाम्रो हिमाली गाउँ र मित्रताको सुन्दर कथा। लेखकलाई धन्यवाद!": "हाम्रो हिमाली गाउँ र मित्रताको सुन्दर कथा। लेखकलाई धन्यवाद!"
    },
    en: {
      // Creative titles (Original in Nepali, translated to English)
      "मयालु चौतारी (The Beloved Resting Tree)": "The Beloved Resting Tree (Mayalu Chautari)",
      "परिवर्तनको सङ्कल्प (Resolve for Change)": "Resolve for Change",
      "हिमालको छायाँ (Shadow of the Himalayas)": "Shadow of the Himalayas",
      "अध्याय १: दौंतरी (The Companions)": "Chapter 1: The Companions",
      "अध्याय २: चिसो हावा (The Cold Wind)": "Chapter 2: The Cold Wind",

      // Creative excerpts
      "गाउँको पुछारमा रहेको त्यो बूढो बरको रूख र चौतारी केवल बटुवाहरू भारी बिसाउने ठाउँ मात्र थिएन, त्यहाँ गाउँका कयौँ पुस्ताका प्रेम, रोदन र हाँसोका कथाहरू लुकेका थिए...":
        "The old Banyan tree and resting stone platform at the edge of the village were not just a place for travelers to drop their loads, it held decades of stories of love, tears, and laughter...",
      "सुतेका आँखाहरूलाई बिउँझाउनु छ अब, गुमेका आवाजहरूलाई जगाउनु छ अब, इतिहासको यो मोडमा उभिएर...":
        "Sleeping eyes must be awakened now, lost voices must be revived now, standing at this turning point of history...",
      "सोलुखुम्बुको विकट गाउँबाट सुरु भएको दुई बालसखाहरूको जीवन यात्रा, जसले हिमालका चुचुराहरू मात्र नापेनन्, सहरको संघर्ष र मानवीय सम्बन्धका जटिल उतारचढावहरू पनि भोगे...":
        "The life journey of two childhood friends starting from a remote village in Solukhumbu, who did not just climb Himalayan peaks but also experienced city struggles and complex human relationships...",

      // Creative contents (Original in Nepali)
      "<p>गाउँको पुछारमा, जहाँ तीनवटा गोरेटो बाटोहरू जोडिएर डाँडातिर उकालो लाग्छन्, त्यहाँ एउटा पुरानो चौतारी छ। ढुङ्गाले चिनेको, छेउमा बूढो बर र पिपलको रूख भएको त्यो चौतारीलाई गाउँलेले 'मयालु चौतारी' भन्थे। यो नाम कसले राख्यो, कसैलाई सम्झना थिएन। तर, त्यहाँ बिसाइने प्रत्येक भारी र बस्ने प्रत्येक मानिसले एउटा अद्भूत शान्तिको अनुभूति गर्थे।</p>":
        "<p>At the edge of the village, where three dirt paths merge and climb up the hill, stands an old stone platform (Chautari). Paved with stones and shaded by ancient Banyan and Peepal trees, the villagers called it 'Mayalu Chautari' (The Beloved Resting Tree). Nobody remembered who named it, but every heavy load put down there and every traveler resting on it experienced an extraordinary sense of peace.</p>",
      "<p>हरि बहादुर बुबा, जसको उमेरले ७० को डाँडो काटिसकेको थियो, हरेक साँझ एउटा बाँसको लाठी टेक्दै त्यहाँ आइपुग्थे। उनी चौतारीको सबैभन्दा चिल्लो ढुङ्गामा बस्थे, जसलाई वर्षौँदेखि बटुवाका कपडा र मानिसका पिठ्युँले घोटेर चिल्लो बनाएको थियो। हरि बुबाको लागि यो ठाउँ एउटा टाइम मेसिन जस्तै थियो।</p>":
        "<p>Father Hari Bahadur, whose age had crossed 70, reached there every evening leaning on his bamboo cane. He would sit on the smoothest stone of the Chautari, worn polished by travelers' clothes and resting backs over the years. For Hari Buwa, this place was like a time machine.</p>",
      "<p>\"यो चौतारी मेरो बुबाले मेरो जन्मको खुसीयालीमा चिन्नुभएको हो रे,\" हरि बुबा कहिलेकाहीँ त्यहाँ सुस्ताउन आउने युवाहरूलाई सुनाउँथे। \"हाम्रो पालामा पहाडबाट मधेश झर्दा भारी बिसाउने र गफगाफ गर्ने मुख्य केन्द्र यही थियो। यहाँ कति माया जोडिए, कति सुख-दुःख साटिए।\"</p>":
        "<p>\"They say this Chautari was built by my father to celebrate my birth,\" Hari Buwa would sometimes tell the youth who came there to relax. \"In our days, this was the primary resting and gathering hub when walking down from the hills to the plains. So many relationships were forged here, so many joys and sorrows shared.\"</p>",
      "<p>विगतको पाना पल्टाउँदा हरि बुबाको आँखा रसायन्थ्यो। उनले आफ्नी स्वर्गीय पत्नी सुन्तलीलाई पहिलो पटक यही चौतारीमा भेटेका थिए। सुन्तली पँधेरोबाट पानीको गाग्री बोकेर उकालो चढ्दै गर्दा यही चौतारीमा थकाई मार्न बसेकी थिइन्। त्यतिबेला साटिएको त्यो पहिलो मुस्कान, जीवनभरको सहयात्रामा परिणत भएको थियो।</p>":
        "<p>Flipping back the pages of the past, Hari Buwa's eyes would well up. He met his late wife Suntali for the first time right at this Chautari. Suntali, carrying a water pitcher from the community tap, had paused here to catch her breath. The first smile exchanged then had blossomed into a lifelong partnership.</p>",
      "<p>आज गाउँमा मोटर बाटो पुगेको छ। मानिसहरू अब गोरेटो बाटो हिँड्दैनन्, गाडीमा हुइँकिन्धन्। चौतारी सुनसान देखिन्छ, तर बर र पिपलको शितल छहारी र हरि बुबाको स्मृति अझै पनि त्यहीँ जीवित छ। गाउँ परिवर्तन हुँदैछ, तर मयालु चौतारीले सिकाएको हार्दिकता र गाउँलेपन अझै पनि हामो मुटुमा जीवन्त हुनुपर्छ।</p>":
        "<p>Today, a motorable road has reached the village. People no longer walk the footpaths; they whiz past in vehicles. The Chautari looks deserted now, yet the cool shade of the Banyan and Peepal trees, along with Hari Buwa's memories, live on. The village is changing, but the warmth and community spirit taught by Mayalu Chautari must remain alive in our hearts.</p>",

      // Poem
      "<p>सुतेका आँखाहरूलाई बिउँझाउनु छ अब,<br>\n          गुमेका आवाजहरूलाई ब्युँताउनु छ अब।<br>\n          मौनताको जाँतोले पिसेका सपनालाई,<br>\n          नयाँ क्षितिजको उज्यालो देखाउनु छ अब।</p>":
        "<p>Sleeping eyes must be awakened now,<br>\n          Lost voices must be brought back now.<br>\n          To the dreams ground by the mill of silence,<br>\n          A new light on the horizon must be shown now.</p>",
      "<p>को छ यहाँ सानो, को छ यहाँ ठूलो?<br>\n          सबैको रगत रातो, माटो एउटै चुल्हो।<br>\n          विभेदका अग्ला पर्खालहरू ढालेर,<br>\n          समताको नयाँ बिहान ल्याउनु छ अब।</p>":
        "<p>Who is small here, and who is big?<br>\n          Everyone's blood is red, the hearth is of the same clay.<br>\n          Tearing down the tall walls of discrimination,<br>\n          A new dawn of equality must be brought now.</p>",
      "<p>कलम समात्ने हातहरू एक जुट होऔँ,<br>\n          माटो खन्ने पाइलाहरू सँगसँगै हिँडौँ।<br>\n          यो देशको मुहार फेर्ने सङ्कल्प बोकेर,<br>\n          परिवर्तनको बिगुल फुक्नु छ अब।</p>":
        "<p>Let the hands that hold pens unite,<br>\n          Let the feet that till the soil walk together.<br>\n          Carrying the resolve to change the face of this nation,<br>\n          The bugle of change must be blown now.</p>",
      "<p>हिमालका काखदेखि तराईका फाँटसम्म,<br>\n          गुन्जियोस् यो आवाज सीमापारिसम्म।<br>\n          हामी आफैँ नबदली बदलिँदैन समाज,<br>\n          त्यसैले त बोल्दैछ 'परिवर्तनका लागि आवाज'!</p>":
        "<p>From the laps of the Himalayas to the plains of Tarai,<br>\n          Let this voice echo even beyond borders.<br>\n          Unless we change ourselves, society will not transform,<br>\n          That is why speaks the 'Voice for Change'!</p>",

      // Novel Chapter 1
      "<p>बिहानको सूर्यको पहिलो झुल्को जब नुम्बुर हिमालको सेतो चुचुरोमा ठोक्किन्थ्यो, सोलुको जुजिङ गाउँमा एउटा अलौकिक चमक छाउँथ्यो। त्यो हिउँको चमकसँगै ब्युँझन्थे, लाक्पा र दोर्जे। दुवैको उमेर लगभग १२ वर्ष थियो, तर उनीहरूको मित्रता गाउँकापुराना रूखहरू जस्तै गहिरो थियो।</p>":
        "<p>When the first rays of the morning sun struck the white peak of Numbur mountain, a divine glow spread over Jujing village in Solu. Awakening alongside that snowy glitter were Lhakpa and Dorje. Both were about 12 years old, but their friendship was as deep as the village's ancient trees.</p>",
      "<p>लाक्पा अलि शान्त स्वभावको थियो, सधैँ किताबका पानाहरू पल्टाउन मन पराउने। दोर्जे भने चञ्चल, चौंरीहरू लखेट्दै भीरपहरा डुलिहिँड्ने। दुवैको संसार फरक भए पनि उनीहरू एकअर्का बिना अधुरा थिए।</p>":
        "<p>Lhakpa was somewhat quiet, always preferring to flip through book pages. Dorje, on the other hand, was playful, running around cliffs chasing yaks. Though their worlds were different, they were incomplete without each other.</p>",
      "<p>\"लाक्पा! आज त स्कुल बिदा हो, हिँड न त गुम्बा डाँडातिर चौंरी चराउन जाऔँ,\" दोर्जेले लाक्पाको ढोकामा उभिएर घ्याम्पो जत्रो टाउको हल्लाउँदै करायो।</p>":
        "<p>\"Lhakpa! Today school is closed, come on, let's go herd yaks near the Gumba Hill,\" Dorje shouted standing at Lhakpa's door, shaking his large round head.</p>",
      "<p>लाक्पाले आफ्नो काँधमा झुन्ड्याएको च्यातिएको झोलाबाट कापी झिक्दै भन्यो, \"मलाई त गृहकार्य गर्नु छ दोर्जे, मास्टर सा'बले भोलि चेक गर्नुहुन्छ।\"</p>":
        "<p>Lhakpa pulled a notebook out of the torn bag slung on his shoulder and said, \"I have to do homework Dorje, the master will check it tomorrow.\"</p>",
      "<p>\"धत् तेरो गृहकार्य! हिमालको छहारीमा बसेर पढ्नुको मजा बेग्लै हुन्छ, त्यहीँ बसेर गरौँला,\" दोर्जेले लाक्पाको हात समातेर तान्यो। लाक्पाले नाइँ भन्न सकेन। दुवै किशोर चौंरीका घण्टीको मधुर आवाज पछ्याउँदै सेता डाँडाहरू तर्फ उकालो लागे। उनीहरूलाई थाहा थिएन, यो हिमालको काख तिनीहरूले सधैँका लागि भोग्न पाउने छैनन्।</p>":
        "<p>\"Forget your homework! Studying in the shadow of the mountain is a different kind of joy, we will do it there,\" Dorje pulled Lhakpa by his hand. Lhakpa couldn't refuse. Both teens climbed up towards the snowy hills, following the sweet sound of yak bells. They didn't know they wouldn't enjoy this mountain lap forever.</p>",

      // Chapter 2
      "<p>गुम्बा डाँडामा चिसो हावा सिरेटो झैँ चलिरहेको थियो। तल फेदीमा जुजिङ गाउँ साना ढुङ्गे ओतहरू जस्तै देखिन्थ्यो। लाक्पा एउटा ठूलो ढुङ्गामा कापी फिँजाएर मसी भर्दै थियो, दोर्जे भने टाढा चौंरीहरू चरिरहेको नियाल्दै सुस्केरा हाल्दै थियो।</p>":
        "<p>The cold mountain wind was blowing like a whistle on Gumba Hill. Down below, Jujing village looked like tiny stone huts. Lhakpa was spreading his notebook on a large boulder to fill ink, while Dorje was sighing as he watched the yaks grazing in the distance.</p>",
      "<p>\"दोर्जे, तिमीलाई कहिलेकाहीँ लाग्दैन, यो हिमाल पारि के होला?\" लाक्पाले कलम टोक्दै सोध्यो।</p>":
        "<p>\"Dorje, don't you sometimes wonder what lies beyond these mountains?\" Lhakpa asked, biting his pen.</p>",
      "<p>\"हिमाल पारि ठूलो सहर छ रे, काठमाडौँ। जहाँ गाडीहरू कुद्छन्, ठूला घरहरू छन् र बिजुलीका बत्तीहरू कहिल्यै निभ्दैनन् रे। मेरा दाइले भन्नुभएको।\"</p>":
        "<p>\"They say there's a big city beyond the mountains, Kathmandu. Where cars run, houses are huge, and electrical lights never turn off. My brother told me.\"</p>",
      "<p>\"के हामी कहिल्यै त्यहाँ पुगौँला त?\" लाक्पाको आँखामा जिज्ञासा चम्कियो।</p>":
        "<p>\"Will we ever reach there?\" A spark of curiosity lit up Lhakpa's eyes.</p>",
      "<p>\"पुगौँला नि किन नपुग्नु! तर मलाई त यो हिमाल छाडेर जान मन छैन। यहाँको चिसो हावा र चौंरीको दूध छोडेर सहरको धुलोमा कसरी बस्नु?\" दोर्जेको स्वरमा अनौठो गम्भीरता थियो। तर समय सधैँ एकनाश रहँदैन। त्यही साँझ जुजिङ गाउँमा एउटा नसोचेको खबर आइपुग्यो, जसले लाक्पा र दोर्जेको बाल्यकाललाई सदाका लागि छिन्नभिन्न पारिदियो।</p>":
        "<p>\"We will, why not! But I don't want to leave these mountains. Leaving this cold wind and fresh yak milk, how could I live in the city's dust?\" There was a strange seriousness in Dorje's voice. But time never stays the same. That very evening, an unexpected news reached Jujing village, shattering Lhakpa and Dorje's childhood forever.</p>",

      // Chapter Titles
      "अध्याय १: दौंतरी (The Companions)": "Chapter 1: The Companions",
      "अध्याय २: चिसो हावा (The Cold Wind)": "Chapter 2: The Cold Wind",
      
      // Comments from database (Original in Nepali)
      "Suresh Thapa": "Suresh Thapa",
      "Mina Shrestha": "Mina Shrestha",
      "Dipendra Oli": "Dipendra Oli",
      "Sanjana KC": "Sanjana KC",
      "Kiran Roka": "Kiran Roka",
      "Dawa Sherpa": "Dawa Sherpa",
      "निकै मार्मिक कथा! हाम्रो गाउँघरका चौतारीहरू साँच्चै नै हाम्रा सम्पदा हुन्, तिनको संरक्षण गर्नुपर्छ।":
        "A very touching story! The Chautaris of our villages are indeed our heritage, we must protect them.",
      "हरि बुबाको कथाले मेरो आफ्नै हजुरबुबाको याद दिलायो। सुन्दर प्रस्तुति!":
        "Hari Buwa's story reminded me of my own grandfather. Beautifully presented!",
      "ओझिलो कविता! हरेक नेपालीको मन छुने शब्दहरू।":
        "Deep poem! Words that touch the heart of every Nepali.",
      "परिवर्तनका लागि आवाजको नारा कवितामा निकै राम्रोसँग प्रस्तुत गरिएको छ।":
        "The slogan of 'Voice for Change' is very well represented in the poem.",
      "सोलुको जनजीवनको जीवन्त चित्रण! अध्याय ३ को तीव्र पर्खाइमा छु।":
        "Vivid depiction of life in Solu! Eagerly waiting for Chapter 3.",
      "हाम्रो हिमाली गाउँ र मित्रताको सुन्दर कथा। लेखकलाई धन्यवाद!":
        "A beautiful story of our Himalayan village and friendship. Thanks to the author!"
    }
  };

  // Helper function to translate static keys
  function getStaticTranslation(key, lang) {
    if (staticDictionary[key]) {
      return staticDictionary[key][lang] || staticDictionary[key]['np'];
    }
    return null;
  }

  // Global translate function (wraps values from dynamic arrays or general text)
  window.t = function (text) {
    if (!text) return '';
    const currentLang = localStorage.getItem('lang') || 'np';
    
    // Check if there is a mapping in dataDictionary for the active language
    if (dataDictionary[currentLang] && dataDictionary[currentLang][text]) {
      return dataDictionary[currentLang][text];
    }
    
    // Otherwise look up in static dictionary just in case it's a static key passed in
    if (staticDictionary[text]) {
      return staticDictionary[text][currentLang] || staticDictionary[text]['np'];
    }

    return text;
  };

  // Global helper to translate date format (e.g. "June 15, 2026" or "June 17, 2026")
  window.translateDate = function (dateStr) {
    if (!dateStr) return '';
    const currentLang = localStorage.getItem('lang') || 'np';
    if (currentLang === 'en') {
      // If original date is in Nepali, translate it to English? 
      // The database defaults are in English, e.g. "June 15, 2026", so it returns it as is.
      // If it's a Nepali formatted date like "जुन १५, २०२६", we can map months if needed.
      return dateStr;
    }

    const monthsMap = {
      'January': 'जनवरी', 'February': 'फेब्रुअरी', 'March': 'मार्च', 'April': 'अप्रिल',
      'May': 'मे', 'June': 'जुन', 'July': 'जुलाई', 'August': 'अगस्ट',
      'September': 'सेप्टेम्बर', 'October': 'अक्टोबर', 'November': 'नोभेम्बर', 'December': 'डिसेम्बर'
    };

    let translated = dateStr;
    for (const [eng, nep] of Object.entries(monthsMap)) {
      translated = translated.replace(new RegExp(eng, 'g'), nep);
    }

    // Convert digits to Nepali numerals
    const digitsMap = {
      '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
      '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
    };

    return translated.split('').map(char => digitsMap[char] || char).join('');
  };

  // Helper to translate element text/placeholder
  function translateElement(el, translation) {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = translation;
    } else if (el.tagName === 'OPTION') {
      el.text = translation;
    } else {
      // Check if it has an icon child to preserve it
      const icon = el.querySelector('i');
      if (icon) {
        // Determine if the icon was at the start or the end of innerHTML
        const isIconFirst = el.innerHTML.trim().startsWith('<i');
        el.innerHTML = '';
        if (isIconFirst) {
          el.appendChild(icon);
          el.appendChild(document.createTextNode(' ' + translation));
        } else {
          el.appendChild(document.createTextNode(translation + ' '));
          el.appendChild(icon);
        }
      } else {
        el.innerHTML = translation;
      }
    }
  }

  // Global function to apply translations to all data-i18n elements
  window.applyTranslations = function () {
    const currentLang = localStorage.getItem('lang') || 'np';

    // Translate all elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = getStaticTranslation(key, currentLang);
      if (translation !== null) {
        translateElement(el, translation);
      }
    });

    // Update Language Toggle Button Label
    const toggleText = document.getElementById('lang-toggle-text');
    if (toggleText) {
      toggleText.innerText = currentLang === 'np' ? 'EN' : 'ने';
    }

    // Update document HTML lang attribute
    document.documentElement.setAttribute('lang', currentLang);
  };

  // Global function to inject the language toggle button into .nav-actions
  window.initLanguageToggle = function () {
    const navActions = document.querySelector('.nav-actions');
    if (navActions && !document.getElementById('lang-toggle')) {
      const currentLang = localStorage.getItem('lang') || 'np';
      
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'icon-btn';
      toggleBtn.id = 'lang-toggle';
      toggleBtn.style.fontWeight = '800';
      toggleBtn.style.fontSize = '0.85rem';
      toggleBtn.style.fontFamily = 'var(--font-sans)';
      toggleBtn.style.cursor = 'pointer';
      toggleBtn.setAttribute('aria-label', 'Switch Language / भाषा परिवर्तन');
      toggleBtn.setAttribute('title', 'Switch Language / भाषा परिवर्तन गर्नुहोस्');
      
      toggleBtn.innerHTML = `<span id="lang-toggle-text">${currentLang === 'np' ? 'EN' : 'ने'}</span>`;
      
      // Insert as the first child of nav-actions (before search button)
      navActions.insertBefore(toggleBtn, navActions.firstChild);

      // Toggle click handler
      toggleBtn.addEventListener('click', () => {
        const activeLang = localStorage.getItem('lang') || 'np';
        const newLang = activeLang === 'np' ? 'en' : 'np';
        localStorage.setItem('lang', newLang);

        // Apply translations to static HTML elements
        window.applyTranslations();

        // Dynamically re-trigger render loops if the functions exist in page-scope scripts
        if (typeof renderHero === 'function') renderHero();
        if (typeof renderLatestNews === 'function') renderLatestNews();
        if (typeof renderGalleryPreview === 'function') renderGalleryPreview();
        if (typeof renderCreativePreview === 'function') renderCreativePreview();
        if (typeof renderNews === 'function') renderNews();
        if (typeof renderGallery === 'function') renderGallery();
        if (typeof renderList === 'function') renderList();
        
        // Dynamic Single Reader Pages re-render
        if (typeof showReaderView === 'function' && typeof creativeState !== 'undefined' && creativeState.activeLiteratureId) {
          showReaderView(creativeState.activeLiteratureId);
        }
        if (typeof showDetailView === 'function' && typeof newsState !== 'undefined' && newsState.activeArticleId) {
          showDetailView(newsState.activeArticleId);
        }
      });
    }
  };

  // Run initial translations after all DOMContentLoaded work (modals injection, etc.) has finished
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      window.initLanguageToggle();
      window.applyTranslations();
    }, 50);
  });
})();
