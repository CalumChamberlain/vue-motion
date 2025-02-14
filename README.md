# Vue Motion

A Vue.js component for creating smooth animations and transitions with minimal effort. This is a Vue.js port of [motion.dev](https://motion.dev/), bringing its powerful animation capabilities to the Vue ecosystem.

📚 **Documentation and Examples**: [https://motion-vuejs.vercel.app/](https://motion-vuejs.vercel.app/)

## Installation

```bash
npm install vue-motion
```

## Usage

### Global Registration

```javascript
import { createApp } from 'vue'
import Motion from 'vue-motion'

const app = createApp(App)
app.use(Motion)
```

### Local Registration

```javascript
import { Motion } from 'vue-motion'

export default {
  components: {
    Motion
  }
}
```

## Features

The Motion component provides a rich set of animation capabilities:

- **Enter/Exit Animations**: Animate elements when they mount or unmount
- **Hover Animations**: Add interactive animations when users hover over elements
- **Tap/Press Animations**: Animate elements when users click or tap
- **Scroll-based Animations**: Trigger animations when elements come into view
- **Custom Transitions**: Control animation duration, easing, and timing
- **Flexible Element Types**: Use any HTML element or component as the motion wrapper

### Props

- `as`: Type of element to render (default: 'div')
- `enter`: Animation properties for element entrance
- `exit`: Animation properties for element exit
- `animate`: General animation properties
- `transition`: Transition settings (duration, easing)
- `whileHover`: Animation properties during hover
- `whileTap`: Animation properties during press/tap
- `show`: Control element visibility
- `inView`: Enable scroll-based animations
- `reverseOutView`: Reverse animation when scrolling out of view

## Development

1. Install dependencies:
```bash
npm install
```

2. Build the package:
```bash
npm run build
```

## License

MIT
