# Tailwind CSS Integration Validation Plan

**Feature**: Tailwind CSS Integration
**Created**: 2026-01-11
**Status**: Draft

## Focus Area: Tailwind CSS Integration

This plan focuses on validating and restoring Tailwind CSS in the project by examining all critical components of the Tailwind integration.

## Technical Context

The project is a Next.js 16+ application with Tailwind CSS dependencies installed but experiencing issues with CSS not being applied, resulting in plain HTML rendering. This plan will validate each component of the Tailwind CSS integration pipeline.

## Validation Plan

### 1. Presence and Correctness of tailwind.config.js

**Validation Steps:**
- Check if `frontend/tailwind.config.js` file exists
- Verify the configuration includes:
  - `content` array with correct paths matching project structure
  - `theme` configuration (if customized)
  - `plugins` array (if any custom plugins)
  - `mode: 'jit'` or `mode: 'aot'` for Just-In-Time compilation

**Expected Outcome:**
- File exists with proper configuration
- Content paths include all relevant directories: `./src/**/*.{js,ts,jsx,tsx}`, `./pages/**/*.{js,ts,jsx,tsx}`, `./components/**/*.{js,ts,jsx,tsx}`

### 2. Content Paths Matching Project Structure

**Validation Steps:**
- Map actual project structure to content paths in tailwind.config.js
- Verify all relevant directories containing JSX/TSX files are included
- Check for correct glob patterns that match Next.js App Router structure
- Ensure paths cover: app/, components/, lib/, hooks/, etc.

**Expected Outcome:**
- Content paths accurately reflect the project's file structure
- All directories with potential Tailwind classes are included
- Patterns match Next.js 16+ App Router conventions

### 3. globals.css Existence and Correctness

**Validation Steps:**
- Verify `frontend/src/app/globals.css` file exists
- Check for presence of Tailwind directives in correct order:
  - `@tailwind base;`
  - `@tailwind components;`
  - `@tailwind utilities;`
- Ensure no duplicate or conflicting CSS rules
- Verify custom CSS is properly scoped (using `@layer` if needed)

**Expected Outcome:**
- File exists with all three required Tailwind directives
- Directives are in the correct order
- No conflicting CSS rules that might override Tailwind

### 4. Tailwind Directives Validation

**Validation Steps:**
- Confirm `@tailwind base;` directive exists and imports foundational styles
- Verify `@tailwind components;` directive exists for component classes
- Ensure `@tailwind utilities;` directive exists for utility classes
- Check for proper placement in the CSS file

**Expected Outcome:**
- All three directives are present in the correct sequence
- No typos or incorrect syntax in the directives

### 5. Correct Import of globals.css in Application Entry Point

**Validation Steps:**
- Locate the main layout or entry point file (likely `frontend/src/app/layout.tsx`)
- Verify `import './globals.css';` or similar import statement exists
- Check that the import occurs early in the file, before other imports that might depend on the styles
- Ensure no conflicting stylesheets override Tailwind

**Expected Outcome:**
- globals.css is imported in the root layout
- Import occurs in the correct location
- No conflicting styles override Tailwind classes

### 6. Build Tool or Framework Expectations

**Validation Steps:**
- Verify Next.js 16+ compatibility with Tailwind CSS
- Check that PostCSS configuration exists (postcss.config.js)
- Ensure Tailwind and Autoprefixer plugins are included in PostCSS config
- Confirm no conflicting CSS frameworks are installed
- Validate package.json has correct versions of dependencies

**Expected Outcome:**
- PostCSS configuration exists and includes Tailwind plugin
- Dependencies are compatible with Next.js 16+
- No conflicting CSS frameworks interfere with Tailwind

### 7. Common Mistakes Leading to "Plain HTML" Rendering

**Validation Steps:**
- Check if Tailwind classes are being used correctly in components
- Verify there are no build errors preventing CSS generation
- Ensure Tailwind is not disabled in any configuration
- Confirm NODE_ENV is not preventing Tailwind from running in development
- Check for any CSS-in-JS libraries that might conflict with Tailwind
- Verify no custom webpack configuration interferes with Tailwind processing

**Expected Outcome:**
- No blocking issues preventing Tailwind from functioning
- All common mistakes are identified and addressed
- Clear path to restore Tailwind functionality

## Verification Process

For each validation step:
1. Document current state
2. Compare with expected state
3. Identify discrepancies
4. Note remediation steps needed
5. Record findings in research document

## Common Remediation Actions

If issues are found, typical fixes include:
- Creating missing configuration files
- Updating content paths in tailwind.config.js
- Ensuring proper import order in globals.css
- Installing missing dependencies
- Correcting PostCSS configuration
- Resolving conflicts with other CSS frameworks

## Success Criteria

The validation is successful when:
- All configuration files exist and are correctly configured
- Tailwind directives are properly placed and referenced
- Build process processes Tailwind classes without errors
- Application renders with proper Tailwind styling instead of plain HTML