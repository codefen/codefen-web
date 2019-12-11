# MSFT sticky buttons

## Desktop behavior

- The sticky buttons don't appear over the hero module.
- The sticky buttons appear when the user scroll 50% of the hero aprox.
- The first two buttons appear, Share by email and Download PDF.
- When the user scrolls back to the hero module the buttons will hide.
- The feedback button will appear when the middle of the page is reached.
- The feedback button will open itself when the bottom of the page is almost reached, like final CTA module or disclaimer.
- The feedback button will close when the user scrolls back to the top of the page.
- When the user hover with the cursor each button will slide out to display the text.

## Mobile behavior

- The sticky buttons don't appear when the page loads.
- The sticky buttons won't appear as the user scrolls down the page.
- All sticky buttons will appear when the user scrolls back to the top of the page.
- The feedback button will open itself below the final CTA module.

## Design

- There's no hover color on rollover.

## Analytics Tagging

- The default tagging will be already coded.
- Some values will need to be fill before pushing to production. e.g. 'e-book' for 'data-bi-dltype'

## Gulpfile

Create task to fill and/or replace the following values:

- Share by email: URL and Subject.
- Download PDF: path replacement for pdf, document name for data-bi-dlnm.

## Resarch

- Research competition, how do they share content?
- Research techniques, for mobile and desktop.
- Research JS libraries, review with MSFT for approval.
- Research Analitics, do we need the "Share by email" button?

## Development

- Add methods/envets to turn on and off the sticky buttons for websites without scrollbar and/or on-demand.
- Review settings to show and/or hide the buttons.


HEADER
- Migrar header de producción
