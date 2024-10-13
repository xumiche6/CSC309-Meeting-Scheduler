from itertools import permutations
from datetime import datetime, timedelta
from itertools import product


def add_duration_to_time(start_time_str, duration_minutes):
    # Convert start time string to datetime
    start_time = datetime.strptime(start_time_str, "%I:%M %p")

    end_time = start_time + timedelta(minutes=duration_minutes)

    # format conversion
    end_time_str = end_time.strftime("%I:%M %p")

    return end_time_str


def match_availability(given_availability):
    matched_results = []

    invitee1_availability = [entry for entry in given_availability if 'invitee1' in entry]
    invitee2_availability = [entry for entry in given_availability if 'invitee2' in entry]

    for invitee1_time in invitee1_availability:
        for invitee2_time in invitee2_availability:
            matched_results.append({'invitee1': invitee1_time.get('invitee1', ''),
                                    'invitee2': invitee2_time.get('invitee2', '')})

    return matched_results


def generate_meeting_options(each_phase_availability):
    options = {}

    # Generate all combinations of options for each phase
    all_options = list(product(*each_phase_availability.values()))

    for i, option_combination in enumerate(all_options, start=1):
        option_key = f"option{i}"
        options[option_key] = option_combination

    # Calculate priority_sum for each option
    options_with_priority_sum = {}
    for option_key, option_combination in options.items():
        priority_sum = sum(int(entry.split()[-1]) for phase in option_combination for entry in phase.values())
        options_with_priority_sum[option_key] = {'priority_sum': priority_sum, 'option': option_combination}

    # Sort options based on priority_sum (less is better option)
    sorted_options = {f"option{i}": v['option'] for i, (k, v) in enumerate(
        sorted(options_with_priority_sum.items(), key=lambda x: x[1]['priority_sum'], reverse=False), start=1)}
    return sorted_options if len(sorted_options) <= 2 else dict(list(sorted_options.items())[:2])


def find_meeting_options(sender_availabilities, invitees_availability):
    recommend_schedules = {}
    each_phase_availability = {}

    sender_availabilities.sort(key=lambda x: x['priority'], reverse=False)
    for phase, invitees in invitees_availability.items():
        each_phase_availability[phase] = []
        all_match_within_phase = {}
        all_match_within_phase[phase] = []

        invitee_permutations = list(permutations(invitees.keys()))
        for perm in [invitee_permutations[0]]:
            option = {}
            for i, invitee in enumerate(perm):
                invitee_schedule = invitees[invitee]
                for slot in invitee_schedule:
                    for sender_slot in sender_availabilities:
                        if (
                                slot["day"] == sender_slot["day"]
                                and sender_slot["start_time"] <= slot["start_time"]
                                and add_duration_to_time(sender_slot["start_time"],
                                                         sender_slot["duration"]) >= add_duration_to_time(
                            slot["start_time"],
                            slot["duration"])
                        ):
                            end_time = add_duration_to_time(slot["start_time"], slot["duration"])
                            day = f'{slot["day"]} {slot["start_time"]}-{end_time} {phase} {sender_slot["priority"]}'
                            option[f"invitee{i + 1}"] = day
                            all_match_within_phase[phase].append({f"invitee{i + 1}": day})

            each_phase_availability[phase].extend(match_availability(all_match_within_phase[phase]))

        recommend_schedules = generate_meeting_options(each_phase_availability)

    return recommend_schedules
