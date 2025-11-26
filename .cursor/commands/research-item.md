# Research item

## Overview
Create a well structured one pager about the specified item, ensuring all the information to add the item to the website is included and sourced.

## Steps
1. **Research**
  - find trusted sources of information on design objects and design history. wikipedia, museum websites and reputable print magazines that focus on design are preferred sources
  - create a research md file in /research with the name of the object as the name of the file (if one already exists, update it)
  - try hard to find sources other than the manufacturer's website. The manufacturer is a good source of information for basic facts, but you should seek analysis and reviews to understand what people think and feel about the design
2. **Distill structured data**
  - try to ensure all the factual data fields in /sanity/schemas/item.ts have a value and a source
  - if you have not found the value of a field, DO NOT GUESS. instead just write "could not find"
  - dimensions should be given in metric units only. Prefer to use mm or metres (not centimetres). Use the "Ø" symbol in reference to diameters
  - attempt to find the weight of the object in grams or kilegrams
3. **Description field**
  - based on all that you've read, draft a description field
  - the description should be written in the present tense
  - do not use hyphens as punctuation
  - target a reading age of 14 years old
  - this should have a 3 paragraph structure
  - keeps the description under 250 words
  - use british english
    - The first paragraph should introduce the object and the brands and designers who made it. Do not include any of the structured information here other than the object's name. Very short, single sentence.
    - The second paragraph should talk about it's design, materials and manufacturing process. Where they revolutionary, novel, or where they traditional
    - The third paragraph should explain it's cultural relevance. Why was it significant when it was released? Why is it still important today? What lasting impact on culture has it had? What does it evoke today

4. **Images**
  - there should be minimum 2, maximum 5 hi res images of the product. The ideal images should be against a nuetral or white background and not include any people or other items in the photo
  - the images should be downloaded into /research/img and given names that start with the name of the object
  - the images should be listed in the one pager doc and attribution should be recorded here as well
5. **Designer and brand**
  - it is important to record the brand that the itam pertains to. This is usually the company that manufactures it
  - if possible, please identify the person who was most responsible for the item's design. IF you find this info, please include the source alongside it in the doc