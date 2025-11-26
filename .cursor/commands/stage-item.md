# Stage item

Populate the sanity cms with information about an item from a markdown file.

## Steps
1. verify
  - ensure a markdown file pertaining to the requested item exists
  - ensure any images reference in the research file exist in research/img
  - use the sanity mcp to verify there is no existing published item in the cms
  - IMPORTANT: stop the task at this point if either of these steps fail and explain why you stopped
2. create/update item in cms
  - using the sanity mcp, create or update the draft of the item in the cms with the data in the markdown file
  - if there is n/a or no information in a field, do not populate the field at all. DO NOT populate the field with n/a or not specified. Leave the field blank
  - using the sanity mcp, upload the images to the cms and associate the images to the item uin the images array. include the attribution and alt text from the markdown file for each image
  - search for the relevant brand and/or designer for the item and associate those if they exist in the cms
  - if there is not a record for a brand or designer, make this clear once the task is complete
  - DO NOT PUBLISH THE CHANGES YOU MAKE HERE
3. report back
  - provide a link to view the new/updated item in the cms
  - report relevant info re designer and brand
