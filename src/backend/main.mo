import Array "mo:base/Array";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor Emoly {

  // ─── Types ───────────────────────────────────────────────────────────────

  public type Story = {
    id: Nat;
    title: Text;
    theme: Text;
    excerpt: Text;
    body: Text;
  };

  public type CompanionResponse = {
    comfort: Text;
    reflection: Text;
  };

  public type ChatMessage = {
    id: Nat;
    text: Text;
    alias: Text;
    timestamp: Int;
    replyTo: ?Nat;
  };

  // ─── State ─────────────────────────────────────────────────────────────

  var nextMsgId : Nat = 1;
  var chatMessages : [ChatMessage] = [];

  // ─── Story Library ───────────────────────────────────────────────────────

  let stories : [Story] = [
    { id = 1; theme = "loneliness"; title = "The Empty Room";
      excerpt = "Some nights the silence feels heavier than anything you've ever carried...";
      body = "Some nights the silence feels heavier than anything you've ever carried. You scroll through your phone, see everyone's highlight reels, and wonder why your world feels so quiet. You're not broken. Loneliness visits even the most loved people. You are here, and that matters." },
    { id = 2; theme = "loneliness"; title = "The Crowded Room";
      excerpt = "You were surrounded by people, yet felt completely invisible...";
      body = "You were surrounded by people laughing, talking, connecting — and you stood there feeling completely invisible. Sometimes loneliness isn't about being alone. It's about feeling unseen. You are seen here." },
    { id = 3; theme = "anxiety"; title = "The Spiral";
      excerpt = "Your mind started with one small thought and somehow ended up at the worst...";
      body = "Your mind started with one small thought — a text you sent, a word you said — and somehow it spiraled into every worst-case scenario. The spiral is exhausting. But you've survived every one of them so far. That's not nothing. That's everything." },
    { id = 4; theme = "anxiety"; title = "Before the Big Day";
      excerpt = "The night before felt impossible. Your heart wouldn't slow down...";
      body = "The night before felt impossible. Your heart wouldn't slow down, your thoughts wouldn't quiet, and sleep felt like a distant country. Anxiety lies to you — it tells you the worst is certain. It isn't. You've done hard things before." },
    { id = 5; theme = "heartbreak"; title = "The Last Message";
      excerpt = "You read it again. And again. Trying to find something you missed...";
      body = "You read it again. And again. Searching for a hidden meaning, a door left open. There wasn't one. Heartbreak rewires your whole world. It's okay to grieve that. Healing isn't linear and it doesn't have a deadline." },
    { id = 6; theme = "heartbreak"; title = "Seeing Them Move On";
      excerpt = "You weren't ready to see them happy without you...";
      body = "You weren't ready. You saw the photo and it felt like the floor dropped out. You're not weak for hurting. You loved someone fully. That's brave. Your healing is happening even when it doesn't feel like it." },
    { id = 7; theme = "self-doubt"; title = "Not Good Enough";
      excerpt = "Everyone else seemed to have it figured out. You felt two steps behind...";
      body = "Everyone else seemed to have it figured out. The right career, the right confidence, the right answers. You felt two steps behind and ten levels below. Comparison steals presence. You are exactly where you need to be right now." },
    { id = 8; theme = "self-doubt"; title = "The Mistake";
      excerpt = "You kept replaying it. Wishing you could take it back...";
      body = "You kept replaying it. One decision, one word, one moment you wish you could undo. You are not the sum of your worst moments. Growth lives in the space between mistake and what comes next." },
    { id = 9; theme = "burnout"; title = "Running on Empty";
      excerpt = "You couldn't remember the last time you felt rested...";
      body = "You couldn't remember the last time you felt genuinely rested. Every morning started with dread. Every night ended with exhaustion. Burnout isn't weakness. It's what happens when you give more than you have for too long. Rest is not a reward. It's a right." },
    { id = 10; theme = "burnout"; title = "Just One More Thing";
      excerpt = "You kept saying yes when every part of you wanted to say no...";
      body = "You kept saying yes. To one more task, one more favor, one more deadline. And slowly, quietly, you disappeared into it all. You are allowed to stop. You are allowed to put yourself back on your own list." }
  ];

  // ─── Companion Logic ─────────────────────────────────────────────────────

  func getThemeResponse(theme: Text) : CompanionResponse {
    switch theme {
      case "loneliness" {
        { comfort = "Feeling alone doesn't mean you are alone. This very moment, countless people feel exactly what you're feeling. You reached out today — that took courage.";
          reflection = "What's one small thing that has made you feel connected to someone, even briefly, recently?" }
      };
      case "anxiety" {
        { comfort = "Your nervous system is trying to protect you, even when it gets it wrong. The fear feels real, but you are safe right now. You've navigated every hard moment before this one.";
          reflection = "What does your anxiety most need from you right now — rest, reassurance, or a gentle reminder of your strength?" }
      };
      case "heartbreak" {
        { comfort = "Grief after love is just love with nowhere to go. There is nothing wrong with you for hurting this deeply.";
          reflection = "What part of yourself did you rediscover — or want to rediscover — on the other side of this?" }
      };
      case "self-doubt" {
        { comfort = "Self-doubt often visits the most thoughtful, caring people. The fact that you question yourself shows how much you care. That's a strength, not a flaw.";
          reflection = "If your best friend felt this way about themselves, what would you tell them?" }
      };
      case "burnout" {
        { comfort = "You have been carrying so much for so long. It's okay to set it down. Rest is not laziness — it's how you come back to yourself.";
          reflection = "What is one thing you can release today — even just for an hour — to give yourself space to breathe?" }
      };
      case _ {
        { comfort = "Whatever you're carrying right now, you don't have to carry it alone. You came here, and that matters.";
          reflection = "What would feel most supportive for you in this moment?" }
      };
    }
  };

  func detectTheme(text: Text) : Text {
    let lower = Text.toLowercase(text);
    if (Text.contains(lower, #text "alone") or Text.contains(lower, #text "lonely") or Text.contains(lower, #text "isolated") or Text.contains(lower, #text "invisible") or Text.contains(lower, #text "no one")) {
      "loneliness"
    } else if (Text.contains(lower, #text "anxious") or Text.contains(lower, #text "anxiety") or Text.contains(lower, #text "worry") or Text.contains(lower, #text "scared") or Text.contains(lower, #text "panic") or Text.contains(lower, #text "nervous") or Text.contains(lower, #text "fear")) {
      "anxiety"
    } else if (Text.contains(lower, #text "heartbreak") or Text.contains(lower, #text "breakup") or Text.contains(lower, #text "broke up") or Text.contains(lower, #text "lost them") or Text.contains(lower, #text "miss them") or Text.contains(lower, #text "ex ")) {
      "heartbreak"
    } else if (Text.contains(lower, #text "not enough") or Text.contains(lower, #text "failure") or Text.contains(lower, #text "worthless") or Text.contains(lower, #text "stupid") or Text.contains(lower, #text "hate myself") or Text.contains(lower, #text "doubt")) {
      "self-doubt"
    } else if (Text.contains(lower, #text "tired") or Text.contains(lower, #text "exhausted") or Text.contains(lower, #text "burnout") or Text.contains(lower, #text "drained") or Text.contains(lower, #text "overwhelmed") or Text.contains(lower, #text "can't anymore")) {
      "burnout"
    } else {
      "general"
    }
  };

  func getMoodAffirmation(mood: Text) : Text {
    switch mood {
      case "happy" { "Hold onto that feeling — you deserve every bit of it. Joy is meant to be savored." };
      case "sad" { "Sadness is just love that has nowhere to go right now. It's okay to feel it fully." };
      case "anxious" { "Your worries are real, but so is your resilience. Take one breath. You're not alone in this." };
      case "angry" { "Anger is often hurt in disguise. Whatever sparked this, your feelings are valid and worth understanding." };
      case "lonely" { "Loneliness is one of the hardest feelings. You are not as alone as you feel right now." };
      case "numb" { "Numbness is your mind's way of protecting you. There's no rush. Feeling will return in its own time." };
      case "overwhelmed" { "You don't have to solve everything today. One breath, one moment. That's enough right now." };
      case _ { "Whatever you're feeling, it's valid. You reached out, and that takes courage." };
    }
  };

  // ─── Story API ───────────────────────────────────────────────────────────

  public query func getStories() : async [Story] { stories };

  public query func getStoriesByTheme(theme: Text) : async [Story] {
    Array.filter(stories, func(s: Story) : Bool { s.theme == theme })
  };

  public query func ventMessage(message: Text) : async CompanionResponse {
    getThemeResponse(detectTheme(message))
  };

  public query func selectStory(storyId: Nat) : async CompanionResponse {
    let matched = Array.filter(stories, func(s: Story) : Bool { s.id == storyId });
    if (matched.size() > 0) { getThemeResponse(matched[0].theme) }
    else { getThemeResponse("general") }
  };

  public query func checkInMood(mood: Text) : async Text {
    getMoodAffirmation(mood)
  };

  public query func getThemes() : async [Text] {
    ["loneliness", "anxiety", "heartbreak", "self-doubt", "burnout"]
  };

  // ─── Anonymous Chat API (E'm You) ────────────────────────────────────────

  public func postMessage(text: Text, alias: Text) : async ChatMessage {
    let msg : ChatMessage = {
      id = nextMsgId;
      text = text;
      alias = alias;
      timestamp = Time.now();
      replyTo = null;
    };
    nextMsgId += 1;
    chatMessages := Array.append(chatMessages, [msg]);
    msg
  };

  public func replyToMessage(text: Text, alias: Text, replyToId: Nat) : async ChatMessage {
    let msg : ChatMessage = {
      id = nextMsgId;
      text = text;
      alias = alias;
      timestamp = Time.now();
      replyTo = ?replyToId;
    };
    nextMsgId += 1;
    chatMessages := Array.append(chatMessages, [msg]);
    msg
  };

  public query func getMessages() : async [ChatMessage] {
    let all = chatMessages;
    let size = all.size();
    // Clamp to last 100
    let start : Nat = if (size > 100) { size - 100 } else { 0 };
    let count : Nat = size - start;
    // Build slice then reverse for newest-first
    let slice = Array.tabulate(count, func(i : Nat) : ChatMessage { all[start + i] });
    Array.tabulate(count, func(i : Nat) : ChatMessage { slice[count - 1 - i] })
  };

  public query func getMessageReplies(messageId: Nat) : async [ChatMessage] {
    Array.filter(chatMessages, func(m: ChatMessage) : Bool {
      switch (m.replyTo) {
        case (?id) { id == messageId };
        case null { false };
      }
    })
  };

};
