<script setup>
import { animate, press, hover, inView } from 'motion'
import { ref, onMounted, nextTick, computed, watch } from 'vue'

const props = defineProps({
    as: {
        type: String,
        default: 'div'
    },
    enter: {
        type: [Object, Array],
        default: null
    },
    exit: {
        type: [Object, Array],
        default: null
    },
    animate: {
        type: Object,
        default: null
    },
    transition: {
        type: Object,
        default: () => ({
            duration: 1,
            ease: 'easeInOut',
        })
    },
    whileHover: {
        type: Object,
        default: null
    },
    whileTap: {
        type: Object,
        default: null
    },
    easing: {
        type: [String, Array],
        default: 'ease-out'
    },
    show: {
        type: Boolean,
        default: true
    },
    inView: {
        type: Boolean,
        default: true
    },
    reverseOutView: {
        type: Boolean,
        default: false
    }
})

const elementRef = ref(null)
const internalShow = ref(false)
const currentState = ref({})
const initialState = ref(null)

// Get the computed style of an element for a specific property
const getComputedProperty = (element, property) => {
    const computedStyle = window.getComputedStyle(element)

    // Map motion properties to CSS properties
    const cssPropertyMap = {
        x: 'transform',
        y: 'transform',
        scale: 'transform',
        rotate: 'transform',
        boxShadow: 'box-shadow',
        backgroundColor: 'background-color',
        borderRadius: 'border-radius',
        opacity: 'opacity'
    }

    const cssProperty = cssPropertyMap[property]
    if (!cssProperty) return null

    if (cssProperty === 'transform') {
        const transform = computedStyle.transform
        if (transform === 'none') {
            return property === 'scale' ? 1 : 0
        }

        // Parse transform matrix to get values
        // This is a simplified version - you might want to add more complete transform parsing
        const matrix = transform.match(/matrix(?:3d)?\((.*)\)/)?.[1].split(', ')
        if (matrix) {
            switch (property) {
                case 'scale':
                    return parseFloat(matrix[0]) || 1
                case 'rotate':
                    return 0 // You'd need more complex math to extract rotation from matrix
                case 'x':
                    return parseFloat(matrix[4]) || 0
                case 'y':
                    return parseFloat(matrix[5]) || 0
            }
        }
    }

    return computedStyle[cssProperty]
}

// Initialize the initial state of the element
const initializeState = (element) => {
    if (!element || initialState.value) return

    const defaultState = {
        scale: 1,
        rotate: 0,
        x: 0,
        y: 0,
        opacity: 1
    }

    // Get all properties that might be animated
    const properties = new Set([
        ...Object.keys(props.whileHover || {}),
        ...Object.keys(props.whileTap || {}),
        ...Object.keys(props.animate || {})
    ])

    const state = {}
    properties.forEach(property => {
        const computedValue = getComputedProperty(element, property)
        state[property] = computedValue !== null ? computedValue : defaultState[property]
    })

    initialState.value = state
    currentState.value = { ...state }
}

// Get the current state to return to
const getBaseState = () => {
    // Start with initial state
    const baseState = { ...initialState.value }

    // Override with current animated state if exists
    if (props.animate) {
        Object.entries(props.animate).forEach(([key, value]) => {
            baseState[key] = Array.isArray(value) ? value[value.length - 1] : value
        })
    }

    // Override with current state
    Object.entries(currentState.value).forEach(([key, value]) => {
        baseState[key] = value
    })

    return baseState
}

const showElement = computed(() => props.show && internalShow.value)

onMounted(() => {
    nextTick(() => {
        if (elementRef.value) {
            initializeState(elementRef.value)
        }
        internalShow.value = true
    })
})

watch(() => elementRef.value, () => {
    if (elementRef.value) {
        initializeState(elementRef.value)

        if (props.whileHover) {
            hover(elementRef.value, (element) => {
                const prevState = getBaseState()
                animate(element, props.whileHover, props.transition)

                return () => {
                    // Return to previous state, preserving any animated properties
                    animate(element, prevState, props.transition)
                }
            })
        }

        if (props.whileTap) {
            press(elementRef.value, (element) => {
                const prevState = getBaseState()
                animate(element, props.whileTap, props.transition)

                return () => {
                    // Return to previous state, preserving any animated properties
                    animate(element, prevState, props.transition)
                }
            })
        }

        if (props.inView && props.enter) {
            inView(elementRef.value, () => {
                const prevState = getBaseState()

                animate(elementRef.value, props.enter, props.transition)
                    .then(() => {
                        updateCurrentState(props.enter)
                    })
                if (props.reverseOutView) {
                    return () => {
                        animate(elementRef.value, prevState, props.transition)
                    }
                }
            })
        }

        if (props.animate) {
            animate(elementRef.value, props.animate, props.transition)
                .then(() => {
                    updateCurrentState(props.animate)
                })
        }
    }
})

const updateCurrentState = (newState) => {
    const finalState = {}
    Object.entries(newState).forEach(([key, value]) => {
        finalState[key] = Array.isArray(value) ? value[value.length - 1] : value
    })
    currentState.value = {
        ...currentState.value,
        ...finalState
    }
}

watch(() => props.animate, (newValue) => {
    if (elementRef.value && newValue) {
        animate(elementRef.value, newValue, props.transition)
            .then(() => {
                updateCurrentState(newValue)
            })
    }
})

const animateOut = async (element, done) => {
    if (props.exit) {
        await animate(element, props.exit, props.transition)
    }
    done()
}

const animateIn = async (element, done) => {
    if (props.enter) {
        await animate(element, props.enter, props.transition)
            .then(() => {
                updateCurrentState(props.enter)
            })
    }
    done()
}
</script>

<template>
    <Transition :css="false" @leave="animateOut" @enter="animateIn" appear>
        <component :is="as" ref="elementRef">
            <slot />
        </component>
    </Transition>
</template>