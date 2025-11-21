// Suppress console errors for better user experience
const originalConsoleError = console.error

console.error = (...args) => {
  const message = args.join(' ')
  
  // Suppress specific Supabase rate limit errors
  if (message.includes('429') || 
      message.includes('rate limit') || 
      message.includes('Too Many Requests') ||
      message.includes('supabase.co/auth/v1/signup')) {
    return // Don't log these errors
  }
  
  // Log other errors normally
  originalConsoleError.apply(console, args)
}

export default {}