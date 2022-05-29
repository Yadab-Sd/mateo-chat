import cn from 'classnames';
import { ContentState, Editor, EditorState } from 'draft-js';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import 'draft-js/dist/Draft.css';

export { ContentState, EditorState };

interface PropTypes {
  name?: string;
  value?: string;
}
interface SelectedFileType {
  name: string;
  data: string;
}

export default function DraftEditor({ name }: PropTypes) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileType[]>([]);

  function getPreviewImg(file: Blob) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve({ name: (file as File).name, data: fileReader.result });
      };
      fileReader.onerror = () => {
        reject(fileReader.result);
      };
    });
  }

  const pasteAction = async (files: Blob[]) => {
    if (files?.length > 0) {
      const outFiles: SelectedFileType[] = await Promise.all(
        files.map((file) => getPreviewImg(file)) as Promise<SelectedFileType>[]
      ).catch(() => {
        return [];
      });

      setSelectedFiles((prevFiles: SelectedFileType[]) => {
        const newFiles = [...prevFiles];
        newFiles.push(...outFiles);
        return newFiles;
      });
    }
  };

  const pasteActionOthers = (e: ClipboardEvent) => {
    const files = e.clipboardData?.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file && !file.type.startsWith('image')) {
          getPreviewImg(file);
        }
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles: SelectedFileType[]) => {
      return [...prevFiles]?.filter((_, i) => i !== index);
    });
  };

  // for rest files (without image)
  useEffect(() => {
    window.addEventListener('paste', (e: Event) => {
      pasteActionOthers(e as ClipboardEvent);
    });
  });

  return (
    <div className='flex flex-col'>
      <div
        id='filesContainer'
        className={cn('mt-1 flex flex-wrap', {
          hidden: !selectedFiles?.length,
        })}
      >
        {selectedFiles.map((data, i) => (
          <div
            key={data.data}
            className='max-w-18 relative m-2 mb-2 h-12 rounded shadow-md '
          >
            <button
              className='times'
              onClick={() => {
                removeFile(i);
              }}
            >
              ×
            </button>
            <Image
              src={data.data}
              className='overflow-hidden object-cover'
              alt={data.name}
              width='48'
              height='48'
            />
          </div>
        ))}
      </div>
      <div className='h-24 flex-grow p-4 text-sm'>
        <Editor
          editorKey={name}
          editorState={editorState}
          onChange={setEditorState}
          handlePastedFiles={(files) => {
            pasteAction(files);
            return 'handled';
          }}
          placeholder='Type here...'
        />
      </div>
    </div>
  );
}