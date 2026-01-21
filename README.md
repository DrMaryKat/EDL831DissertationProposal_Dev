# EDL 831: Proposal Development Course

Interactive course modules for doctoral students developing their dissertation proposals.

## 🎓 Course Overview

**EDL 831** is an independent study course designed for doctoral students in Educational Leadership who are writing the first three chapters of their dissertation proposal. Building on EDL 830 (Doctoral Inquiry Seminar), students work one-on-one with their professor to develop:

- **Chapter 1**: Introduction (Problem, Questions, Purpose, Significance)
- **Chapter 2**: Literature Review (Synthesis, Theoretical/Conceptual Framework)
- **Chapter 3**: Methodology (Design, Sampling, Data Collection, Analysis, Ethics)

## 📚 Course Structure

| Phase | Weeks | Focus |
|-------|-------|-------|
| **Phase 1** | 1-4 | Foundations & Chapter 2 |
| **Phase 2** | 5-7 | Chapter 1 Development |
| **Phase 3** | 8-12 | Chapter 3 Development |
| **Phase 4** | 13-16 | Integration & Defense |

## ✨ Interactive Features

Each weekly module includes:

- **📋 Learning Objectives** - Clear goals for the week
- **✅ Task Checklists** - Track your progress on independent work
- **📝 Knowledge Check Quizzes** - Test your understanding with immediate feedback
- **✍️ Reflection Exercises** - Deepen learning through writing (auto-saved)
- **📊 Self-Assessments** - Rate your confidence on key competencies
- **👤 Professor Meeting Guide** - Prepare for productive meetings

## 💾 Progress Tracking

Your progress is automatically saved to your browser's local storage:
- Task completion status
- Quiz answers and results
- Reflection responses
- Self-assessment ratings

Progress persists between sessions on the same device.

## 🚀 Live Demo

Visit the course: [EDL 831 Course Modules](https://yourusername.github.io/edl831/)

## 🛠️ Deployment

### GitHub Pages

1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose `main` branch and `/ (root)` folder
5. Click Save

Your site will be live at `https://yourusername.github.io/edl831/`

### Local Development

Simply open `index.html` in a web browser. No server required.

```bash
# Clone the repository
git clone https://github.com/yourusername/edl831.git

# Open in browser
open index.html
```

## 📁 File Structure

```
edl831/
├── index.html          # Course overview and navigation
├── week01.html         # Week 1: Course Orientation
├── week02.html         # Week 2: Literature Review Strategies
├── ...
├── week16.html         # Week 16: Post-Defense & Next Steps
├── styles.css          # All styling
├── script.js           # Interactive functionality
└── README.md           # This file
```

## 🎨 Customization

### Colors

Edit CSS variables in `styles.css`:

```css
:root {
  --primary-navy: #1a365d;
  --primary-gold: #c9a227;
  --success: #38a169;
  /* ... */
}
```

### Content

Edit the `WEEKS` array in `generate_interactive.py` and regenerate:

```bash
python3 generate_interactive.py
```

## 📱 Responsive Design

Modules are fully responsive and work on:
- 💻 Desktop browsers
- 📱 Mobile devices
- 📲 Tablets

## 🔒 Privacy

All data is stored locally in your browser. No information is sent to any server.

## 📄 License

This course content is provided for educational purposes.

## 👤 Contact

For questions about the course, contact your professor or program coordinator.

---

**Spring 2026 | Department of Educational Leadership & Policy Studies**
