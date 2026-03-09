
const experiences = [
  {
    role: "Intern Information Technology Department",
    company: "AirNav Indonesia · Internship",
    period: "Oct 2025 - Present · 6 mos",
    location: "Tangerang, Banten, Indonesia · On-site",
    logo: "/images/logo_airnav.png",
    tech: "Flutter, Mobile Application Development, Engineering, Software Infrastructure, Information Technology Infrastructure",
    order: 0,
  },
  {
    role: "Signal Processing Teaching Assistant",
    company: "Universitas Syiah Kuala · Part-time",
    period: "Mar 2025 - Jun 2025 · 4 mos",
    location: "Banda Aceh, Aceh, Indonesia · On-site",
    logo: "/images/logo_usk.svg.png",
    tech: "MATLAB",
    order: 1,
  },
  {
    role: "Multimedia Signal Processing Teaching Assistant",
    company: "Universitas Syiah Kuala",
    period: "Jul 2024 - Dec 2024 · 6 mos",
    location: "Banda Aceh, Aceh, Indonesia · On-site",
    logo: "/images/logo_usk.svg.png",
    tech: "MATLAB, Encoding, Decoding, Signal Processing, Image Processing",
    order: 2,
  },
  {
    role: "Software Engineering Lab Assistant",
    company: "Universitas Syiah Kuala",
    period: "Feb 2024 - Jun 2024 · 5 mos",
    location: "Banda Aceh, Aceh, Indonesia · On-site",
    logo: "/images/logo_usk.svg.png",
    tech: "Scrum, Unified Modeling Language (UML)",
    order: 3,
  },
  {
    role: "Head of Public Relations Division",
    company: "Himpunan Mahasiswa Teknik Komputer USK",
    period: "Jan 2024 - Dec 2024 · 1 yr",
    location: "Banda Aceh, Aceh, Indonesia · On-site",
    logo: "/images/logo_himatekkom.png",
    tech: "Public Speaking, Leadership, Teamwork",
    order: 4,
  },
  {
    role: "Member of Public Relations Division",
    company: "Himpunan Mahasiswa Teknik Komputer USK",
    period: "Jan 2023 - Dec 2023 · 1 yr",
    location: "Banda Aceh, Aceh, Indonesia · On-site",
    logo: "/images/logo_himatekkom.png",
    tech: "Teamwork",
    order: 5,
  },
  {
    role: "Member of Talent and Interests Division",
    company: "Himpunan Mahasiswa Teknik Komputer USK",
    period: "Jan 2022 - Dec 2022 · 1 yr",
    location: "Banda Aceh, Aceh, Indonesia · On-site",
    logo: "/images/logo_himatekkom.png",
    tech: "",
    order: 6,
  },
  {
    role: "Bangkit Academy 2023 - Machine Learning Path",
    company: "Bangkit Academy led by Google, Tokopedia, Gojek, & Traveloka · Seasonal",
    period: "Aug 2023 - Jan 2024 · 6 mos",
    location: "Banda Aceh, Aceh, Indonesia · Remote",
    logo: "/images/bangkit_logo.jpg",
    tech: "Machine Learning, Deep Learning",
    order: 7,
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const e of experiences) {
    // Calling the API directly
    const res = await fetch('http://localhost:3001/experiences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer SEED` }, // assuming we bypass or use auth
      body: JSON.stringify(e)
    });
    if (!res.ok) {
        console.error('Failed:', await res.text());
    } else {
        console.log(`Created experience`);
    }
  }
  console.log(`Seeding finished.`);
}

main().catch(console.error);
