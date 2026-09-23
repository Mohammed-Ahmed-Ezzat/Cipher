export const workshopsData = {
  network: {
    id: "network",
    trackTitle: "Network Track Workshop",
    badge: "2 Live Sessions Recorded",
    instructor: "Cipher Network Mentors",
    description: "Intensive 2-day recorded workshop covering core networking concepts, OSI layers, protocols, switching, routing, and practical demonstrations.",
    descriptionAr: "ورشة عمل متسجلة لايف بتغطي أساسيات شبكات الحاسب، ونموذج الـ OSI، والبروتوكولات، والـ Routing & Switching مع تطبيق عملي خطوة بخطوة.",
    folderDriveUrl: "https://drive.google.com/drive/folders/1AEQZMo-KFMgl7HI-13swKyW8SUOLWRYh",
    sessions: [
      {
        day: 1,
        title: "Day 1: Networking Fundamentals & OSI Model",
        date: "19 Sep 2026",
        duration: "Recorded Live Session",
        // Direct stream embed via Google Drive preview
        videoUrl: "https://drive.google.com/file/d/1tYNvVPemvO4osSD1KXBviZr7tR7ukXAy/preview",
        videoDriveUrl: "https://drive.google.com/file/d/1tYNvVPemvO4osSD1KXBviZr7tR7ukXAy/view?usp=sharing",
        // Slides for local canvas viewer & drive backup
        slidesTitle: "Networking 101 - Day 1 Slides",
        slidesCipher: "/pdf-data/network-workshop-day1.cipher",
        slidesPdf: "/pdf/Network-Workshop-Day1.pdf",
        slidesDriveUrl: "https://drive.google.com/file/d/1BmIlV_lAy0R26iG4OwL0HeQkXqYibDIE/view?usp=sharing",
        // Google Docs meeting notes
        notesTitle: "Day 1 Notes & Gemini AI Summary",
        notesUrl: "https://docs.google.com/document/d/1wX1KD0-08nQH4Qq2AznBA8dmdOob7ds5qZJaPAzIu9s/edit?usp=sharing",
        topics: [
          "Introduction to Computer Networks & Topologies",
          "LAN, WAN, MAN & Transmission Media",
          "Deep Dive: The 7 Layers of OSI Reference Model",
          "Encapsulation & Decapsulation Lifecycle",
          "TCP/IP Suite Comparison & Port Numbers",
          "IPv4 Addressing & Subnetting Basics"
        ]
      },
      {
        day: 2,
        title: "Day 2: Routing, Switching & Practical Protocols",
        date: "20 Sep 2026",
        duration: "Recorded Live Session",
        // Direct stream embed via Google Drive preview
        videoUrl: "https://drive.google.com/file/d/1o_IVAvebib5lxlFDgcbUF8IHOu2t80oF/preview",
        videoDriveUrl: "https://drive.google.com/file/d/1o_IVAvebib5lxlFDgcbUF8IHOu2t80oF/view?usp=sharing",
        // Slides for local canvas viewer & drive backup
        slidesTitle: "Networking Learning - Day 2 Slides",
        slidesCipher: "/pdf-data/network-workshop-day2.cipher",
        slidesPdf: "/pdf/Network-Workshop-Day2.pdf",
        slidesDriveUrl: "https://drive.google.com/file/d/1xqywfDaFV0ZMuWqApq_aDfeVYxJJQHp1/view?usp=sharing",
        // Google Docs meeting notes
        notesTitle: "Day 2 Notes & Gemini AI Summary",
        notesUrl: "https://docs.google.com/document/d/1WZXzUg7GfVk2oRKwRh95ZdqgjnuBXTL2FfddcLPu_Ts/edit?usp=sharing",
        topics: [
          "Switching Mechanics & MAC Address Tables",
          "VLANs (Virtual Local Area Networks) & Trunks",
          "Routing Principles & Default Gateways",
          "Static vs. Dynamic Routing Protocols (OSPF, RIP)",
          "DHCP, DNS & Essential Infrastructure Services",
          "Real-World Packet Flow & Troubleshooting"
        ]
      }
    ]
  },

  backend: {
    id: "backend",
    trackTitle: "Backend Track Workshop",
    badge: "2 Live Sessions Recorded",
    instructor: "Cipher Backend Mentors",
    description: "In-depth 2-day recorded backend masterclass covering system architecture, client-server models, RESTful APIs, databases, authentication, and deployment.",
    descriptionAr: "ورشة عمل متسجلة لايف بتعلمك إزاي تبني أنظمة الباك إند باحتراف، وتصمم الـ APIs وقواعد البيانات وتهندل السيرفرات صح.",
    folderDriveUrl: "https://drive.google.com/drive/folders/1F_Z8ilLBkHH4HKRbuv4czE4g2zAdsrFJ?usp=sharing",
    sessions: [
      {
        day: 1,
        title: "Session 1: Backend Architecture & Fundamentals",
        date: "16 Sep 2026",
        duration: "Recorded Live Session",
        videoUrl: "https://drive.google.com/file/d/1N-X5SvAbzlB1bmvIhSrVM6pyWaGjDRZa/preview",
        videoDriveUrl: "https://drive.google.com/file/d/1N-X5SvAbzlB1bmvIhSrVM6pyWaGjDRZa/view?usp=sharing",
        slidesTitle: "Backend Engineering - Session 1 Slides",
        slidesCipher: "/pdf-data/backend-workshop-session1.cipher",
        slidesPdf: "/pdf/Backend-Workshop-Session1.pdf",
        slidesDriveUrl: "https://drive.google.com/file/d/1fnh3S28U7KaYYgaH30CfNE5G4tbzQvAx/view?usp=sharing",
        notesTitle: "Session 1 Notes & Gemini AI Summary",
        notesUrl: "https://docs.google.com/document/d/1xD90o77nRUkHPrGEcbPM-oGbdGM5C7uGfNjOEENb-tM/edit?usp=sharing",
        topics: [
          "Web Architecture & How the Internet Works",
          "Client-Server Model & HTTP/HTTPS Protocols",
          "RESTful API Design Principles & Status Codes",
          "Server Runtimes & Backend Tech Stack Options",
          "Database Foundations (Relational SQL vs NoSQL)",
          "Data Modeling, Entities & Schema Fundamentals"
        ]
      },
      {
        day: 2,
        title: "Session 2: APIs, Databases & Production Engineering",
        date: "17 Sep 2026",
        duration: "Recorded Live Session",
        videoUrl: "https://drive.google.com/file/d/1pWHWKeGPf0-WaNT35dBGfJGT5XkMAEB_/preview",
        videoDriveUrl: "https://drive.google.com/file/d/1pWHWKeGPf0-WaNT35dBGfJGT5XkMAEB_/view?usp=sharing",
        slidesTitle: "Backend Engineering - Session 2 Slides",
        slidesCipher: "/pdf-data/backend-workshop-session2.cipher",
        slidesPdf: "/pdf/Backend-Workshop-Session2.pdf",
        slidesDriveUrl: "https://drive.google.com/file/d/1764XsDpGwTVmbbc-3kkeqSVzD32aAQGr/view?usp=sharing",
        notesTitle: "Session 2 Notes & Gemini AI Summary",
        notesUrl: "https://docs.google.com/document/d/1TxCxTav7mu4L-4xheAK9y36QoRD9SqUvtpEkwFBAVKw/edit?usp=sharing",
        topics: [
          "Advanced Database Relationships & Joins",
          "Authentication, JWT Tokens & Security Best Practices",
          "Middleware Pipeline, Request Validation & Error Handling",
          "API Integration, CRUD Operations & Performance",
          "Deployment Strategies, Environment Config & Cloud Basics",
          "Real-World Hands-on Project Implementation"
        ]
      }
    ]
  },

  frontend: {
    id: "frontend",
    trackTitle: "Frontend Track Workshop",
    badge: "2 Live Sessions Recorded",
    instructor: "Cipher Frontend Mentors",
    description: "Hands-on 2-day recorded masterclass exploring modern web fundamentals, HTML5 structure, CSS styling, frontend architecture, and interactive JavaScript.",
    descriptionAr: "ورشة عمل متسجلة لايف بتعلمك أساسيات الويب الحديث، من أول كود الـ HTML5 وتنسيق الـ CSS لحد ما تبني واجهات تفاعلية كاملة.",
    folderDriveUrl: "https://drive.google.com/drive/folders/1zg1IrPmxsus0KXbngz_4w6Ts5tfMQl61?usp=drive_link",
    hasSeparateSessionFolders: true,
    sessions: [
      {
        day: 1,
        title: "Session 1: Web Fundamentals, HTML & CSS",
        date: "12 Sep 2026",
        duration: "Recorded Live Session",
        // Direct stream embed via Google Drive preview
        videoUrl: "https://drive.google.com/file/d/1eUukfcS0K-wYSwZFXB3C6FBDPZODhqd1/preview",
        videoDriveUrl: "https://drive.google.com/file/d/1eUukfcS0K-wYSwZFXB3C6FBDPZODhqd1/view?usp=sharing",
        // Slides for local canvas viewer & drive backup
        slidesTitle: "Cipher Frontend Workshop - Day 1 Slides",
        slidesCipher: "/pdf-data/frontend-workshop-session1.cipher",
        slidesPdf: "/pdf/Frontend-Workshop-Session1.pdf",
        slidesDriveUrl: "https://drive.google.com/file/d/1GdnXgUnCA5I5-1uSl-bAJoKyT8A4mZZd/view?usp=sharing",
        // Google Docs meeting notes & Gemini AI summary
        notesTitle: "Session 1 Notes & Gemini AI Summary",
        notesUrl: "https://docs.google.com/document/d/1xWvM0wNNq0h0zf_RwAF5X0KfH1KuWTafOa6T1wBComI/edit?usp=sharing",
        // Specific Google Drive folder for Session 1
        folderDriveUrl: "https://drive.google.com/drive/folders/1zg1IrPmxsus0KXbngz_4w6Ts5tfMQl61?usp=drive_link",
        topics: [
          "Web Architecture: Frontend (Browser) vs Backend (Server)",
          "The Frontend Core Trio: HTML (Structure), CSS (Style), JS (Behavior)",
          "HTML5 Essentials: Elements, Texts, Images, Buttons & Links",
          "CSS3 Fundamentals: Selectors, Colors, Fonts & Box Model",
          "Visual Comparison: Raw HTML vs Styled HTML+CSS",
          "Hands-on Live Coding Demo: Interactive Card & Button"
        ]
      },
      {
        day: 2,
        title: "Session 2: Frontend Engineering & Interactive UI",
        date: "13 Sep 2026",
        duration: "Recorded Live Session",
        videoUrl: "https://drive.google.com/file/d/1dqfPFRCHg-qu1hVPWQUpK4YfeyJsRQuQ/preview",
        videoDriveUrl: "https://drive.google.com/file/d/1dqfPFRCHg-qu1hVPWQUpK4YfeyJsRQuQ/view?usp=sharing",
        slidesTitle: "Cipher Frontend Workshop - Day 2 Slides",
        slidesCipher: "/pdf-data/frontend-workshop-session2.cipher",
        slidesPdf: "/pdf/Frontend-Workshop-Session2.pdf",
        slidesDriveUrl: "https://drive.google.com/file/d/1yuaUBnxe_Mh8QyktDfpE0c5PeNNA3i4f/view?usp=sharing",
        notesTitle: "Lecture Notes & Key Takeaways",
        notesUrl: "https://docs.google.com/document/d/10y5560N_zaIHPkqmbdIVGEVnG1rXUe93WXS5valErUo/edit?usp=sharing",
        // Specific Google Drive folder for Session 2
        folderDriveUrl: "https://drive.google.com/drive/folders/1EsQJIBI_ePDreZdGAC4WtWV-L4tkmsre?usp=drive_link",
        topics: [
          "Frontend Architecture & Modern Web Standards",
          "DOM Manipulation, Events & Component Thinking",
          "Responsive Layout Strategies & Flexbox/Grid",
          "State Management & Asynchronous Data Fetching",
          "UI Polish, Micro-Interactions & User Experience",
          "Practical Live Coding & Implementation"
        ]
      }
    ]
  }
};
