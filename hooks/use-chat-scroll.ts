import { useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>; // этот тип представляет собой ссылку на DOM-элемент, который используется для прокрутки чата (объект React.RefObject, указывающий на HTMLDivElement. То есть это ссылка на div)
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean; // должна ли выполняться дополнительная загрузка контента
  loadMore: () => void; // это функция, которая будет вызвана при необходимости выполнить доп. загрузку контента
  count: number; //  текущее количество сообщений в чате
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // извлекаем текущее состояние из "chatRef", представленного как "current". Проверяем с помозью "?" чтобы убедиться, что "chatRef" существует и имеет св-во "current". "topDiv" будет равен null, если "chatRef" отсутствует (равен null)
    const topDiv = chatRef?.current;

    // ф-ия, которая будет вызываться при прокрутке элемента. Она проверет текущую позицию прокрутки и, если проекрутка достигла верхней границы (scrollTop === 0) и "shouldLoadMore" равен "true", вызывается ф-ия "loadMore()"
    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    // Добавляю обработчик события прокрутки к "topDiv". Этот обработчик бцудет вызывать "handleScroll" при событии прокрутки.
    topDiv?.addEventListener("scroll", handleScroll);

    // ф-ия возврата, которая вызывается, когда компонент, содержащий этот эффект, размонтируется или завершиться. Удаляем обработчик
    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef]);

  // код чтобы следить за изменениями в рефах bottomRef, chatRef, count и hasInitialized. Необходим чтобы выполнять автоматическую прокрутку в чате.
  //  Тут "bottomRef" - ссылка на элемент внизу чата, который должен оставаться видимым, слежение за его изменениями помогает определить, когда новые сообщения были добавлены, и нужно выполнить прокрутку
  // "chatRef" - это ссылка для слежения за контейнером чата. Слежение за его изменениями необходимо, чтобы знать, когда пользователь находится в начале чата, и прокрутка должна быть заблокирована. Так же для вычисления расстояния до нижней границы чата при определении, нужно ли выоплнять автом. прокрутку вниз
  //  "hasInitialized" - это состояние. необходимое для определения, был ли чат инициализирован. Первая прокрутка вниз обычно выполняется при инициализации чата, чтобы пользователь увидел нижние (последние) сообщения
  useEffect(() => {
    // извлекаем текущее состояние "bottomRef", если оно есть
    const bottomDiv = bottomRef?.current;

    // извлекаем текущее состояние из "chatRef"
    const topDiv = chatRef.current;

    // это ф-ия, которая возвращает true, если должна выполняться автом. прокрутка вниз. Она проверяет условия:
    // если компонент только что инициализировался (!hasInitialized) и bottomDiv существует, то setHasInitialized устанавливается в true
    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      // если topDiv отсутствует (!topDiv), то ф-ия "shouldAutoScroll" не выполняется
      if (!topDiv) {
        return false;
      }

      // вычисляем расстояние от нижней границы содержимого элемента topDiv до места, где находится текущая прокрутка и сравниваем его с 100.
      
      // topDiv.scrollHeight - высота всего элемента topDiv

      // topDiv.scrollTop - это текущая позиция прокрутки элемента topDiv

      // topDiv.clientHeight - это высота видимой области элемента topDiv
      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      // distanceFromBottom - это разница м-ду высостой всего содержимого и текущей позицией прокрутки от верхней границы, которая осталась непрокрученной и видимой на экране. Если разница меньше или равна 100 пикселям, то значит мы нах-ся близко к нижней границе содержимого.
      return distanceFromBottom <= 100;
    };

    // здесь вызываю shouldAutoScroll и проверяю, возвращает ли она true. Если да, то должна выполнится плавная прокрутка.

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [bottomRef, chatRef, count, hasInitialized]);
};
