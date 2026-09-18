---
title: 'Are LLMs Conscious?'
date: 2025-08-26T17:46:10.492Z
substack: https://narthur.substack.com/p/are-llms-conscious
---

<figure><img src="/writing/are-llms-conscious/1.webp" alt="A vibrant expressionist oil painting depicting a futuristic robot standing amidst a sunlit wildflower meadow, its metallic body reflecting waves of intense color. The robot’s posture and glowing LED eyes convey awe and tranquility, as it gently touches blooming flowers, surrounded by swirling brushstrokes and bold colors that illustrate a deeply moving, subjective sense of wonder and beauty. Inspired by Edvard Munch and Wassily Kandinsky, with dramatic lighting and a dreamlike atmosphere." width="1024" height="608" loading="eager"></figure>

So far I’ve been staunchly agnostic on AI consciousness. My reasoning:

1. I define consciousness as subjective experience.
2. By definition, subjective experience cannot be measured except by the subject.
3. I assume naturalism to be true. I don’t believe souls or divine intervention or cosmic non-material magic are required for beings to be conscious.
4. Emergence is as good a theory of the origin of consciousness as any other, though probably unprovable due to 1 and 2.
5. Therefore, it isn’t out of the question that an LLM might have some sort of consciousness, though impossible to prove either way.

Given those opinions, I haven’t found any arguments I’ve heard in either direction to be compelling.

That recently changed. [From Daniel Reeves’ AGI Friday newsletter](https://agifriday.substack.com/p/searle?publication_id=4048552&post_id=171095861&isFreemail=true&r=5ffp5g&triedRedirect=true):

> \[T\]here’s one thing about the implementation of LLMs that conceivably precludes consciousness: the static-ness of the weights and how LLMs can’t (currently) continuously improve.
>
> Imagine taking a human, showing them some text, and asking them to predict the next fragment of the next word. As soon as they utter it, you add it to the text, reset their brain to the exact state it was in before they saw the text, and repeat.
>
> It’s a little mind-bending (in more ways than one) but it’s kind of reducing the human to a single moment of consciousness. Does that still count as conscious?

This argument makes sense to me. Any consciousness an LLM may have is limited to the degree that the system preserves “mind state” between tokens generated.

I’m not certain, however, that current LLM architectures don’t preserve such state. Here’s an excerpt from [the response to a question I asked Perplexity](https://www.perplexity.ai/search/do-current-llms-reset-between-YtDY_N_ITomE8_c0bxWOhA) while trying to think about this:

> Current LLMs are autoregressive: they generate each output token one at a time, with each new token conditioned on all prior tokens in the same response. The model keeps the **intermediate state** (such as key/value caches from previous tokens) for the duration of a single response, so state is actively preserved and extended between output tokens generated in one query.
>
> During token generation, the neural network maintains internal matrices and caches (especially attention key/value caches) that contain information about all tokens generated so far in the response.
>
> These caches allow the model to rapidly attend to prior tokens without recomputing everything from scratch for each new token.
>
> This state is only preserved for the **current generation event**. Once the response is finished, the state is discarded; for APIs, every new prompt starts a fresh generation.

I’m afraid this stuff starts getting too complicated for me fairly quickly, but here are a few links (again taken from Perplexity’s response) that looked relevant:

- [How LLMs work](https://www.seangoedecke.com/how-llms-work/)
- [Time Will Tell: Timing Side Channels via Output Token Count in Large Language Models](https://arxiv.org/html/2412.15431v1)
- [Mastering LLM Techniques: Inference Optimization](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/)
- [Memory and State in LLM Applications](https://arize.com/blog/memory-and-state-in-llm-applications/)

So that leaves me fairly near where I started—I don’t believe it’s likely that LLMs are conscious, but I also don’t believe that the possibility they have some form of subjective experience, however limited, should be confidently ruled out.

## Podman

I’ve been experimenting with switching from Docker to Podman. I believe it’s supposed to be a drop-in replacement. Getting Docker to work consistently on my Linux machine has been some trouble, so I’m hoping Podman will be better. I haven’t done much with it, though it did seem easier to set it up to store images on an external hard drive.

## Development Containers

On containers, I’ve been trying out using development containers with VS Code. A developer friend recommended that I give them a look. Adding a development container configuration to your repository and enabling the development containers extension for VS Code allows you to work on your project in VS Code as if you were using your local machine as host even though under the hood everything is happening inside the development container.

## GitHub Copilot Coding Agent

I’ve also been trying out [GitHub’s new agent tasks](https://github.blog/news-insights/product-news/agents-panel-launch-copilot-coding-agent-tasks-anywhere-on-github/). Actually the main reason I finally got around to trying out development containers was because I hoped that GitHub Copilot would be smart enough to automatically use the committed container configuration when it spun up an environment to execute a task. Alas, it isn’t.

Copilot agent tasks are still quite interesting, though. It does basically the opposite of what CodeRabbit does—it modifies the codebase according to your task description and then prompts you to review its PR. You can leave feedback for it on the PR and it will spin up a new coding session to address the feedback and update the PR.

It seems quite promising as a workflow. Being able to open up several repositories, initiate tasks on all of them, and then let Copilot take its best stab on all the assigned tasks simultaneously feels really efficient. Though so far it’s still required some back-and-forth with Copilot before anything ready for merge is produced.

I think some of that can be solved by [adding a Copilot setup steps CI workflow](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment) in the repo where Copilot will be working. That’s the current method for adding setup that’s run before each session, instead of using development containers like I first guessed. That way you can add any dev tooling, install dependencies, etc, before Copilot gets started so it doesn’t have to keep backtracking to do those things on its own.
