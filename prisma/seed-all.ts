const techStack = [
  {
    category: "Frontend",
    icon: "mdi:palette-outline",
    items: "React.js, Nuxt.js, Flutter, Tailwind, Bootstrap, JavaScript",
  },
  {
    category: "Backend",
    icon: "mdi:server",
    items: "NestJS, TypeScript, Python, MySQL, PostgreSQL",
  },
  {
    category: "Design",
    icon: "mdi:vector-square",
    items: "Figma, Canva",
  },
  {
    category: "Tools",
    icon: "mdi:wrench-outline",
    items: "Git, Docker, Firebase, Railway",
  },
  {
    category: "ML",
    icon: "mdi:brain",
    items: "Python, TensorFlow, PyTorch, Gemini AI, OpenCV",
  },
  {
    category: "Embedded",
    icon: "mdi:chip",
    items: "Arduino Uno, ESP32, Sensors, Actuators",
  },
];

const projects = [
  {
    title: "Dental Caries Classification using FPN",
    description:
      "Deep learning research project utilizing Feature Pyramid Network architecture for dental caries segmentation and classification. Focused on improving diagnostic accuracy through multi-scale feature extraction.",
    techStack: "Python, TensorFlow, OpenCV, Deep Learning, FPN",
    icon: "mdi:tooth-outline",
    githubUrl: "#",
    demoUrl: "#",
  },
  {
    title: "LeakGuard — IoT Irrigation Monitoring",
    description:
      "IoT-based irrigation leak detection system designed to improve water efficiency aligned with SDG 6.4. Utilizes sensor networks for real-time monitoring and alert mechanisms.",
    techStack: "Arduino, IoT, Sensors, Water Efficiency, SDG 6.4",
    icon: "mdi:water-alert-outline",
    githubUrl: "#",
    demoUrl: "#",
  },
  {
    title: "WudhuCycle — Greywater Reuse System",
    description:
      "Smart greywater reuse system with integrated mobile application built in Flutter. Combines IoT sensing with a user-friendly interface for monitoring water recycling processes.",
    techStack: "Flutter, Arduino, IoT, Mobile App, Sustainability",
    icon: "mdi:recycle-variant",
    githubUrl: "#",
    demoUrl: "#",
  },
  {
    title: "Mobile App Projects",
    description:
      "Collection of Flutter-based mobile applications showcasing cross-platform development skills. Includes various apps with clean architecture, state management, and API integrations.",
    techStack: "Flutter, Dart, REST API, Firebase, Mobile",
    icon: "mdi:cellphone",
    githubUrl: "#",
    demoUrl: "#",
  },
];

const certificates = [
  {
    title: "AWS Certified Cloud Practitioner",
    description: "Validates technical expertise in designing and deploying scalable systems on Amazon Web Services.",
    credentialUrl: "#",
  },
  {
    title: "Belajar Dasar Pemrograman Web",
    description: "Foundational web development course covering HTML, CSS, and modern JavaScript.",
    credentialUrl: "#",
  },
  {
    title: "Belajar Membuat Aplikasi Back-End untuk Pemula",
    description: "Back-end development fundamentals using Node.js and REST APIs on Dicoding Indonesia.",
    credentialUrl: "#",
  },
  {
    title: "Belajar Dasar Pemrograman JavaScript",
    description: "Core JavaScript programming including ES6+ features, async programming, and DOM manipulation.",
    credentialUrl: "#",
  },
  {
    title: "Cloud Computing Learning Path",
    description: "Intensive program by Bangkit Academy focused on Google Cloud Platform, backend services, and modern cloud architectures.",
    credentialUrl: "#",
  },
  {
    title: "Front-End Web Developer Learning Path",
    description: "Comprehensive frontend path covering HTML5, CSS3, JavaScript, PWA, and web accessibility.",
    credentialUrl: "#",
  },
  {
    title: "Machine Learning Foundations",
    description: "Introductory machine learning concepts including supervised/unsupervised learning and model evaluation.",
    credentialUrl: "#",
  },
  {
    title: "Flutter Development Bootcamp",
    description: "End-to-end Flutter development including state management, Firebase integration, and publishing to app stores.",
    credentialUrl: "#",
  },
];

async function seedData(endpoint: string, dataArray: any[]) {
    console.log(`Seeding ${endpoint}...`);
    for (const item of dataArray) {
        const res = await fetch(`http://localhost:3001/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer SEED` },
            body: JSON.stringify(item)
        });
        if (!res.ok) {
            console.error(`Failed to seed ${endpoint}:`, await res.text());
        } else {
            console.log(`Created ${endpoint} entry.`);
        }
    }
}

async function main() {
  await seedData('skills', techStack);
  await seedData('projects', projects);
}

main().catch(console.error);
