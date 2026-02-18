import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const RichText = ({ value, onChange, error }) => {
  return (
    <div>
      <Editor
        apiKey="svuyxvzj58xy2p5n2xtpb4u9sh1dndb5t6ydrg18cs37ouar"
        value={value}
        onEditorChange={(content) => onChange(content)}
        init={{
          height: 250,
          plugins: [
            // Core editing features
            'anchor',
            'autolink',
            'charmap',
            'codesample',
            'emoticons',
            'link',
            'lists',
            'media',
            'searchreplace',
            'table',
            'visualblocks',
            'wordcount',
            'checklist',
            'mediaembed',
            'casechange',
            'formatpainter',
            'pageembed',
            'a11ychecker',
            'tinymcespellchecker',
            'permanentpen',
            'powerpaste',
            'advtable',
            'advcode',
            'advtemplate',
            'ai',
            'uploadcare',
            'mentions',
            'tinycomments',
            'tableofcontents',
            'footnotes',
            'mergetags',
            'autocorrect',
            'typography',
            'inlinecss',
            'markdown',
            'importword',
            'exportword',
            'exportpdf'
          ],
          toolbar:
            'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
          tinycomments_mode: 'embedded',
          tinycomments_author: 'Author name',
          mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' }
          ],
          ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
          uploadcare_public_key: '52f6a26e924056330daf'
        }}
        // initialValue="Enter project description here..."
      />
      {/* Validation error show */}
      {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
    </div>
  );
};

export default RichText;
