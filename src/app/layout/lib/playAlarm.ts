/**
 * 알림을 실제로 울리게 만드는 보조 함수
*/
export function playAlarm(audioEl: HTMLAudioElement) {
  // 사용자가 아무런 상호작용을 진행하지 않고, 설정한 알림 시간에 도달한 경우
  if(!navigator.userActivation.hasBeenActive) {
    // 일단, alert로 처리하고 나중에 토스트 메시지를 하든 말든 진행
    alert(`
      Hello!
      If your alarm is not ringing and you’re seeing this message, it means that the browser has blocked audio playback due to its autoplay policy.

      To enable the alarm sound, please interact with the page (for example, by clicking, navigating, or pressing a button).

      Note: Clicking the “Confirm” button on this message also counts as a valid interaction.
    `);
    return;
  }

  // 사용자가 어떠한 상호작요을 진행한 상태에서, 설정한 알림 시간에 도달한 경우 알림을 발생시킨다.
  audioEl.muted = false;
  audioEl.play();
  audioEl.parentElement!.style.top = "3rem";
}
