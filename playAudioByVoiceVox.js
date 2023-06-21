
export function playAudioByVoiceVox(textData, 
	abortSignal=null,
	audioQueryUrl = "http://127.0.0.1:50021/audio_query?speaker=1", 
	synthesisUrl = "http://127.0.0.1:50021/synthesis?speaker=1",
	) 
{
	var audioQueryData = "&text=" + encodeURIComponent(textData);
	audioQueryUrl = audioQueryUrl + audioQueryData;

	fetch(audioQueryUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: "",
		signal: abortSignal
	})
	.then(response => response.json())
	.then(data => {
		var jsonData = JSON.stringify(data);

		fetch(synthesisUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: jsonData,
			signal: abortSignal
		})
			.then(response => response.blob())
			.then(blob => {
				var audio = new Audio();
				audio.src = URL.createObjectURL(blob);
				audio.play()
					.catch(error => {
						console.error("再生エラー:", error);
					});
			})
			.catch(error => {
				console.error("WAVデータ取得エラー:", error);
			});
	})
	.catch(error => {
		console.error("JSONデータ取得エラー:", error);
	});
}
