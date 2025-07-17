Aravind Kottakota - Portfolio Website
A modern, responsive portfolio website built with vanilla JavaScript and CSS, featuring a clean design and full functionality.

🚀 Features
Responsive Design: Works seamlessly on desktop, tablet, and mobile devices

Dark/Light Theme: Toggle between themes with localStorage persistence

Smooth Navigation: Smooth scrolling between sections with active navigation indicators

Contact Form: Functional contact form with validation and success/error messaging

Resume Download: Downloadable resume functionality

Professional Design: Modern UI with animations, hover effects, and gradients

Accessibility: ARIA labels and semantic HTML structure

SEO Optimized: Proper meta tags and semantic structure

📁 Project Structure
text
portfolio/
├── index.html          # Main HTML file
├── style.css           # CSS styling with responsive design
├── app.js              # JavaScript functionality
└── README.md           # This file
🛠️ Technology Stack
Frontend: HTML5, CSS3, JavaScript (ES6+)

Styling: Modern CSS with CSS Grid and Flexbox

Icons: Font Awesome 6

Form Handling: Formspree integration

Theme: CSS Custom Properties with dark/light mode

🎨 Design Features
Color Scheme: Professional blue and gray palette

Typography: Clean, modern fonts with proper hierarchy

Layout: Card-based design with consistent spacing

Animations: Smooth transitions and hover effects

Mobile-First: Responsive design approach

🔧 Setup Instructions
Local Development
Clone or download the project files

Open index.html in a web browser

For development with live reload, use a local server:

bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using Live Server (VS Code extension)
# Right-click on index.html and select "Open with Live Server"
Deployment Options
1. GitHub Pages
Create a new repository on GitHub

Upload all files to the repository

Go to Settings > Pages

Select "Deploy from a branch"

Choose "main" branch and "/ (root)" folder

Your site will be available at https://yourusername.github.io/repository-name

2. Vercel
Install Vercel CLI: npm i -g vercel

Run vercel in the project directory

Follow the prompts to deploy

Your site will be deployed automatically

3. Netlify
Drag and drop the project folder to Netlify Drop

Or connect your GitHub repository for automatic deployments

📧 Contact Form Configuration
The contact form is configured to use Formspree. To set up your own:

Go to Formspree.io

Create an account and get your form endpoint

Replace the action URL in the contact form (line ~470 in index.html)

Update the JavaScript form handler if needed

🎯 Customization Guide
Updating Content
Personal Information: Edit the data in app.js or directly in index.html

Projects: Update the projects array in the JavaScript file

Skills: Modify the skills sections in the HTML

Styling: Customize colors and layout in style.css

Adding New Sections
Add the HTML structure in index.html

Add corresponding navigation link

Update JavaScript for smooth scrolling

Add custom styling in style.css

Color Customization
The website uses CSS custom properties for easy color customization:

css
:root {
  --color-primary: #21808D;
  --color-background: #FCFCF9;
  --color-text: #13343B;
  /* ... other colors */
}
📱 Responsive Breakpoints
Mobile: < 768px

Tablet: 768px - 1024px

Desktop: > 1024px

🔧 Browser Support
Chrome (latest)

Firefox (latest)

Safari (latest)

Edge (latest)

📄 License
This project is open source and available under the MIT License.

🤝 Contributing
Feel free to fork this project and customize it for your own portfolio needs.

📞 Support
For any questions or support, please reach out via the contact form on the website or email directly.

Built with ❤️ by Aravind Kottakota
