import { env, pipeline } from "@huggingface/transformers";

const MODEL_ID = "onnx-community/whisper-base";
let transcriberPromise;

env.useBrowserCache = true;
env.allowRemoteModels = true;
env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1;

async function getTranscriber(id) {
  if (!transcriberPromise) {
    transcriberPromise = pipeline("automatic-speech-recognition", MODEL_ID, {
      dtype: "q8",
      progress_callback: (event) => {
        if (event.status === "progress") {
          self.postMessage({ id, type: "progress", progress: event.progress });
        }
      },
    }).then((transcriber) => {
      self.postMessage({ id, type: "ready" });
      return transcriber;
    }).catch((error) => {
      transcriberPromise = undefined;
      throw error;
    });
  }
  return transcriberPromise;
}

self.addEventListener("message", async (event) => {
  const { id, audio, language } = event.data;
  try {
    const transcriber = await getTranscriber(id);
    const result = await transcriber(audio, {
      sampling_rate: 16000,
      chunk_length_s: 30,
      stride_length_s: 5,
      language,
      task: "transcribe",
    });
    self.postMessage({ id, type: "result", text: result.text });
  } catch (error) {
    console.error("Offline transcription failed.", error);
    self.postMessage({
      id,
      type: "error",
      error: error instanceof Error ? error.message : "The speech model could not be loaded.",
    });
  }
});
