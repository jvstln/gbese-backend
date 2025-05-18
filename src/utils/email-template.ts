const styles = `
/*! tailwindcss v4.1.4 | MIT License | https://tailwindcss.com */
@layer properties;
@layer theme, base, components, utilities;
@layer theme {
  :root, :host {
    --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;
    --color-white: #fff;
    --spacing: 0.25rem;
    --text-4xl: 2.25rem;
    --text-4xl--line-height: calc(2.5 / 2.25);
    --font-weight-bold: 700;
    --radius-md: 0.375rem;
    --radius-xl: 0.75rem;
    --default-font-family: var(--font-sans);
    --default-mono-font-family: var(--font-mono);
  }
}
@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0 solid;
  }
  html, :host {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");
    font-feature-settings: var(--default-font-feature-settings, normal);
    font-variation-settings: var(--default-font-variation-settings, normal);
    -webkit-tap-highlight-color: transparent;
  }
  hr {
    height: 0;
    color: inherit;
    border-top-width: 1px;
  }
  abbr:where([title]) {
    -webkit-text-decoration: underline dotted;
    text-decoration: underline dotted;
  }
  h1, h2, h3, h4, h5, h6 {
    font-size: inherit;
    font-weight: inherit;
  }
  a {
    color: inherit;
    -webkit-text-decoration: inherit;
    text-decoration: inherit;
  }
  b, strong {
    font-weight: bolder;
  }
  code, kbd, samp, pre {
    font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);
    font-feature-settings: var(--default-mono-font-feature-settings, normal);
    font-variation-settings: var(--default-mono-font-variation-settings, normal);
    font-size: 1em;
  }
  small {
    font-size: 80%;
  }
  sub, sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sub {
    bottom: -0.25em;
  }
  sup {
    top: -0.5em;
  }
  table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
  }
  :-moz-focusring {
    outline: auto;
  }
  progress {
    vertical-align: baseline;
  }
  summary {
    display: list-item;
  }
  ol, ul, menu {
    list-style: none;
  }
  img, svg, video, canvas, audio, iframe, embed, object {
    display: block;
    vertical-align: middle;
  }
  img, video {
    max-width: 100%;
    height: auto;
  }
  button, input, select, optgroup, textarea, ::file-selector-button {
    font: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    letter-spacing: inherit;
    color: inherit;
    border-radius: 0;
    background-color: transparent;
    opacity: 1;
  }
  :where(select:is([multiple], [size])) optgroup {
    font-weight: bolder;
  }
  :where(select:is([multiple], [size])) optgroup option {
    padding-inline-start: 20px;
  }
  ::file-selector-button {
    margin-inline-end: 4px;
  }
  ::placeholder {
    opacity: 1;
  }
  @supports (not (-webkit-appearance: -apple-pay-button))  or (contain-intrinsic-size: 1px) {
    ::placeholder {
      color: currentcolor;
      @supports (color: color-mix(in lab, red, red)) {
        color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }
  }
  textarea {
    resize: vertical;
  }
  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::-webkit-date-and-time-value {
    min-height: 1lh;
    text-align: inherit;
  }
  ::-webkit-datetime-edit {
    display: inline-flex;
  }
  ::-webkit-datetime-edit-fields-wrapper {
    padding: 0;
  }
  ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datetime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-datetime-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-datetime-edit-meridiem-field {
    padding-block: 0;
  }
  :-moz-ui-invalid {
    box-shadow: none;
  }
  button, input:where([type="button"], [type="reset"], [type="submit"]), ::file-selector-button {
    appearance: button;
  }
  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
    height: auto;
  }
  [hidden]:where(:not([hidden="until-found"])) {
    display: none !important;
  }
}
@layer utilities {
  .container {
    width: 100%;
    @media (width >= 40rem) {
      max-width: 40rem;
    }
    @media (width >= 48rem) {
      max-width: 48rem;
    }
    @media (width >= 64rem) {
      max-width: 64rem;
    }
    @media (width >= 80rem) {
      max-width: 80rem;
    }
    @media (width >= 96rem) {
      max-width: 96rem;
    }
  }
  .my-4 {
    margin-block: calc(var(--spacing) * 4);
  }
  .flex {
    display: flex;
  }
  .inline-block {
    display: inline-block;
  }
  .flex-col {
    flex-direction: column;
  }
  .items-center {
    align-items: center;
  }
  .justify-center {
    justify-content: center;
  }
  .rounded-md {
    border-radius: var(--radius-md);
  }
  .rounded-xl {
    border-radius: var(--radius-xl);
  }
  .p-8 {
    padding: calc(var(--spacing) * 8);
  }
  .px-8 {
    padding-inline: calc(var(--spacing) * 8);
  }
  .py-3 {
    padding-block: calc(var(--spacing) * 3);
  }
  .text-4xl {
    font-size: var(--text-4xl);
    line-height: var(--tw-leading, var(--text-4xl--line-height));
  }
  .font-bold {
    --tw-font-weight: var(--font-weight-bold);
    font-weight: var(--font-weight-bold);
  }
  .text-white {
    color: var(--color-white);
  }
}
@property --tw-font-weight {
  syntax: "*";
  inherits: false;
}
@layer properties {
  @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
    *, ::before, ::after, ::backdrop {
      --tw-font-weight: initial;
    }
  }
}
`;

export const verifyEmailHTMLTemplate = ({
  name,
  url,
}: {
  name: string;
  url: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #05238C; padding: 20px 40px; color: #ffffff; text-align: center;">
              <h2 style="margin: 0; font-size: 18px; font-style: italic;">Hy there ${name}</h2>
              <h1 style="margin: 0; font-size: 24px;">Welcome to GBESE 🚀</h1>
              <p style="margin: 5px 0 0;">The only place where debt makes *sense* (sometimes).</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #05238C; margin-top: 0;">Just one more thing...</h2>
              <p style="font-size: 16px; color: #333333;">
                You're almost in! To keep the bad guys out and the good vibes in, we need to verify your email address.
              </p>
              <p style="font-size: 16px; color: #333333;">
                Click the shiny blue button below to confirm that you're indeed real and ready to use GBESE.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" style="background-color: #05238C; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 6px; font-size: 16px; display: inline-block;">
                  Verify My Email
                </a>
              </div>

              <p style="font-size: 14px; color: #666666;">
                If you didn't sign up for GBESE, no worries — you can safely ignore this email. But if you did, and you're excited to settle (and pass on) some debts, then you're in the right place!
              </p>
              <p style="font-size: 14px; color: #666666;">Stay out of debt (or at least keep it moving),</p>
              <p style="font-size: 14px; color: #05238C; font-weight: bold;">- The GBESE Team</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
              © ${new Date().getFullYear()} GBESE Inc. All rights reserved.<br>
              You can't escape your debts, but you can manage them with us.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>


`;

export const verifyEmailTextTemplate = ({
  name,
  url,
}: {
  name: string;
  url: string;
}) => `
Hello ${name},

Welcome to GBESE 🚀
The only place where debt makes *sense* (sometimes).

Just one more thing...

You're almost in! To keep the bad guys out and the good vibes in, we need to verify your email address.

Click the link below to confirm that you're indeed real and ready to use GBESE:

👉 ${url}

If you didn't sign up for GBESE, no worries — you can safely ignore this email.

But if you did, and you're excited to settle (and pass on) some debts, then you're in the right place!

Stay out of debt (or at least keep it moving),

- The GBESE Team

© ${new Date().getFullYear()} GBESE Inc. All rights reserved.
You can't escape your debts, but you can manage them with us.

`;
